// Neon's HTTP driver does one HTTPS round trip per query. Under a registration
// rush the TLS handshakes can pile up and a few fail with connect timeouts or
// "fetch failed" -- transport noise, not a rejection from Postgres. Left alone
// each one costs a student their registration, so retry them.

const TRANSIENT_PATTERN =
  /fetch failed|connect timeout|und_err|econnreset|etimedout|econnrefused|eai_again|socket hang up|network|terminated|aborted|timeouterror|signal timed out/i;

/** Walks the error's `cause` chain -- the useful text is usually nested a few levels down. */
export function isTransient(err: unknown): boolean {
  let current: unknown = err;
  for (let depth = 0; current && depth < 8; depth++) {
    if (current instanceof Error) {
      if (TRANSIENT_PATTERN.test(current.message)) return true;
      const code = (current as { code?: unknown }).code;
      if (typeof code === "string" && TRANSIENT_PATTERN.test(code)) return true;
      current = (current as { cause?: unknown }).cause;
    } else if (typeof current === "string") {
      return TRANSIENT_PATTERN.test(current);
    } else {
      break;
    }
  }
  return false;
}

/**
 * Runs `op`, retrying only transient transport failures. A query Postgres
 * actually rejected (bad SQL, constraint violation) is thrown straight through
 * so we never paper over a real error.
 */
export async function withRetry<T>(
  op: () => Promise<T>,
  {
    attempts = 3,
    baseDelayMs = 120,
    deadlineMs = 12_000,
  }: { attempts?: number; baseDelayMs?: number; deadlineMs?: number } = {},
): Promise<T> {
  let lastErr: unknown;
  const startedAt = Date.now();

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await op();
    } catch (err) {
      lastErr = err;
      if (attempt === attempts || !isTransient(err)) throw err;
      // Never start an attempt we cannot afford to finish -- a student staring
      // at a spinner gives up long before a third stacked timeout returns.
      if (Date.now() - startedAt >= deadlineMs) throw err;

      // Exponential backoff with jitter, so a burst of failures doesn't retry
      // in lockstep and rebuild the same stampede that caused it.
      const delay = baseDelayMs * 2 ** (attempt - 1) * (0.5 + Math.random());
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastErr;
}
