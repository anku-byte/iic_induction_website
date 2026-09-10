import { NextResponse } from "next/server";
import { or, eq } from "drizzle-orm";
import { registrationSchema } from "@/lib/registration-schema";
import { db } from "@/lib/db";
import { registrations } from "@/lib/db/schema";
import { withRetry } from "@/lib/db/retry";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, email, phone, branch, registrationNumber } = parsed.data;

  const row = {
    name,
    email: email.toLowerCase(),
    phone,
    branch,
    registrationNumber: registrationNumber.toUpperCase(),
  };

  try {
    const inserted = await withRetry(() =>
      db
        .insert(registrations)
        .values(row)
        // A double-tap or client retry can't create duplicates: email and
        // registration_number are both unique.
        .onConflictDoNothing()
        .returning({ id: registrations.id }),
    );

    if (inserted.length === 0) {
      // Either a genuine duplicate, or one of our own retries landing after an
      // insert that committed but lost its response. Those look identical here,
      // so compare against the stored row: if it is character-for-character this
      // same submission, the student is registered and should be told so.
      const [existing] = await withRetry(() =>
        db
          .select({
            name: registrations.name,
            email: registrations.email,
            phone: registrations.phone,
            branch: registrations.branch,
            registrationNumber: registrations.registrationNumber,
          })
          .from(registrations)
          .where(
            or(
              eq(registrations.email, row.email),
              eq(registrations.registrationNumber, row.registrationNumber),
            ),
          )
          .limit(1),
      );

      const isSameSubmission =
        existing &&
        existing.name === row.name &&
        existing.email === row.email &&
        existing.phone === row.phone &&
        existing.branch === row.branch &&
        existing.registrationNumber === row.registrationNumber;

      if (!isSameSubmission) {
        return NextResponse.json(
          {
            error:
              "This email or registration number is already registered. If that wasn't you, contact the club.",
          },
          { status: 409 },
        );
      }
    }
  } catch (err) {
    console.error("Registration insert failed", err);
    return NextResponse.json(
      { error: "Could not save your registration. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
