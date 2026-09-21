import { NextRequest, NextResponse } from "next/server";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { moderate, withinLengthLimits } from "@/lib/moderation";
import { hashIp } from "@/lib/hash";
import { getPublishedMessages } from "@/lib/board";

const COOLDOWN_MS = 60_000;

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}

export async function GET() {
  return NextResponse.json({ messages: await getPublishedMessages() });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, message, website } = body as {
    name?: string;
    message?: string;
    website?: string;
  };

  // Honeypot: a real visitor never fills this hidden field. Pretend success
  // so a bot doesn't learn it was caught.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (typeof name !== "string" || typeof message !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const trimmedName = name.trim();
  const trimmedMessage = message.trim();

  if (!withinLengthLimits(trimmedName, trimmedMessage)) {
    return NextResponse.json(
      { error: "Name or message is empty or too long." },
      { status: 400 }
    );
  }

  const ipHash = hashIp(getClientIp(request));

  const recent = await db
    .select({ id: messages.id })
    .from(messages)
    .where(
      and(
        eq(messages.ipHash, ipHash),
        gt(messages.createdAt, new Date(Date.now() - COOLDOWN_MS))
      )
    )
    .limit(1);

  if (recent.length > 0) {
    return NextResponse.json(
      { error: "You're signing too quickly. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  const { status } = moderate(trimmedName, trimmedMessage);

  await db.insert(messages).values({
    name: trimmedName,
    message: trimmedMessage,
    status,
    ipHash,
  });

  // Always a generic success, regardless of published/flagged, so the
  // moderation outcome is never signaled back to the submitter.
  return NextResponse.json({ ok: true });
}
