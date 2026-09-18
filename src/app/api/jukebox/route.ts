import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { songs } from "@/db/schema";
import { moderate } from "@/lib/moderation";
import { hashIp } from "@/lib/hash";
import { parseSpotifyUrl } from "@/lib/spotify-url";

const COOLDOWN_MS = 60_000;
const MAX_NAME_LENGTH = 50;
const MAX_CAPTION_LENGTH = 300;

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}

export async function GET() {
  const published = await db
    .select({
      id: songs.id,
      name: songs.name,
      spotifyUrl: songs.spotifyUrl,
      caption: songs.caption,
      createdAt: songs.createdAt,
    })
    .from(songs)
    .where(eq(songs.status, "published"))
    .orderBy(desc(songs.createdAt))
    .limit(50);

  return NextResponse.json({ songs: published });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, spotifyUrl, caption, website } = body as {
    name?: string;
    spotifyUrl?: string;
    caption?: string;
    website?: string;
  };

  // Honeypot: a real visitor never fills this hidden field. Pretend success
  // so a bot doesn't learn it was caught.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (typeof name !== "string" || typeof spotifyUrl !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const trimmedName = name.trim();
  const trimmedCaption = typeof caption === "string" ? caption.trim() : "";
  const trimmedSpotifyUrl = spotifyUrl.trim();

  if (trimmedName.length === 0 || trimmedName.length > MAX_NAME_LENGTH) {
    return NextResponse.json({ error: "Name is empty or too long." }, { status: 400 });
  }

  if (trimmedCaption.length > MAX_CAPTION_LENGTH) {
    return NextResponse.json({ error: "Caption is too long." }, { status: 400 });
  }

  if (!parseSpotifyUrl(trimmedSpotifyUrl)) {
    return NextResponse.json(
      { error: "That doesn't look like a Spotify track, album, or playlist link." },
      { status: 400 }
    );
  }

  const ipHash = hashIp(getClientIp(request));

  const recent = await db
    .select({ id: songs.id })
    .from(songs)
    .where(
      and(eq(songs.ipHash, ipHash), gt(songs.createdAt, new Date(Date.now() - COOLDOWN_MS)))
    )
    .limit(1);

  if (recent.length > 0) {
    return NextResponse.json(
      { error: "You're sharing too quickly — please wait a moment and try again." },
      { status: 429 }
    );
  }

  // Caption is optional content; "ok" is a safe, non-empty stand-in so the
  // moderation checks that require a non-trivial message don't misfire on
  // an intentionally blank caption.
  const { status } = moderate(trimmedName, trimmedCaption.length > 0 ? trimmedCaption : "ok");

  await db.insert(songs).values({
    name: trimmedName,
    spotifyUrl: trimmedSpotifyUrl,
    caption: trimmedCaption.length > 0 ? trimmedCaption : null,
    status,
    ipHash,
  });

  // Always a generic success, regardless of published/flagged, so the
  // moderation outcome is never signaled back to the submitter.
  return NextResponse.json({ ok: true });
}
