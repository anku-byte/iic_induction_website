import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/registration-schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("GOOGLE_SHEETS_WEBHOOK_URL is not set");
    return NextResponse.json(
      { error: "Registration is not configured. Please contact the club." },
      { status: 500 },
    );
  }

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

  const row = {
    ...parsed.data,
    submittedAt: new Date().toISOString(),
    token: process.env.GOOGLE_SHEETS_SHARED_SECRET ?? "",
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
      // Apps Script web apps 302-redirect to googleusercontent.com; fetch follows it.
      redirect: "follow",
    });

    // Apps Script web apps always respond 200; the real status is in the body.
    const text = await res.text();
    let result: { ok?: boolean; error?: string } | null = null;
    try {
      result = JSON.parse(text);
    } catch {
      /* fall through to the failure below */
    }

    if (!res.ok || !result?.ok) {
      console.error("Apps Script webhook failed", res.status, text);
      return NextResponse.json(
        { error: "Could not save your registration. Please try again." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Apps Script webhook error", err);
    return NextResponse.json(
      { error: "Could not save your registration. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
