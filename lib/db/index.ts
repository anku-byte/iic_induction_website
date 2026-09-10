import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// A healthy query is ~300ms. Node's default connect timeout is 10s, so a stalled
// TLS handshake would hold a request open long enough to stack with retries and
// outlast the user. Cap each attempt well above normal latency but far below
// that, so a bad connection fails fast and the retry gets a fresh one.
const QUERY_TIMEOUT_MS = 5_000;

neonConfig.fetchFunction = (input: unknown, init: Record<string, unknown>) =>
  fetch(input as RequestInfo, {
    ...init,
    signal: AbortSignal.timeout(QUERY_TIMEOUT_MS),
  });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add your Neon pooled connection string to .env.local",
  );
}

// The Neon HTTP driver issues one stateless HTTPS request per query, so a burst
// of concurrent serverless invocations never exhausts a connection pool.
const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

export { schema };
