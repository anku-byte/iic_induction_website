import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/registration-schema";
import { db } from "@/lib/db";
import { registrations } from "@/lib/db/schema";

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

  try {
    const inserted = await db
      .insert(registrations)
      .values({
        name,
        email: email.toLowerCase(),
        phone,
        branch,
        registrationNumber: registrationNumber.toUpperCase(),
      })
      // A double-tap or client retry can't create duplicates: email and
      // registration_number are both unique.
      .onConflictDoNothing()
      .returning({ id: registrations.id });

    if (inserted.length === 0) {
      return NextResponse.json(
        {
          error:
            "This email or registration number is already registered. If that wasn't you, contact the club.",
        },
        { status: 409 },
      );
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
