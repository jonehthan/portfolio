import { NextRequest, NextResponse } from "next/server";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { songs } from "@/db/schema";
import { moderate } from "@/lib/moderation";
import { hashIp } from "@/lib/hash";
import { parseSpotifyUrl } from "@/lib/spotify-url";
import { fetchSpotifyMeta } from "@/lib/spotify-meta";
import { getPublishedSongs } from "@/lib/board";

const COOLDOWN_MS = 60_000;
const MAX_NAME_LENGTH = 50;
const MAX_CAPTION_LENGTH = 300;

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}

export async function GET() {
  return NextResponse.json({ songs: await getPublishedSongs() });
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
  const trimmedSpotifyUrl = spotifyUrl.trim();
  const trimmedCaption = typeof caption === "string" ? caption.trim() : "";

  if (trimmedName.length === 0 || trimmedName.length > MAX_NAME_LENGTH) {
    return NextResponse.json({ error: "Name is empty or too long." }, { status: 400 });
  }

  if (trimmedCaption.length > MAX_CAPTION_LENGTH) {
    return NextResponse.json({ error: "Comment is too long." }, { status: 400 });
  }

  const link = parseSpotifyUrl(trimmedSpotifyUrl);
  if (!link) {
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
      { error: "You're sharing too quickly. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  const meta = await fetchSpotifyMeta(link);
  if (!meta) {
    return NextResponse.json(
      { error: "Couldn't find that on Spotify. Check the link and try again." },
      { status: 400 }
    );
  }

  // The comment is optional; "ok" stands in when it's blank so the
  // message-length check in moderate() doesn't misfire.
  const { status } = moderate(trimmedName, trimmedCaption.length > 0 ? trimmedCaption : "ok");

  await db.insert(songs).values({
    name: trimmedName,
    spotifyUrl: trimmedSpotifyUrl,
    caption: trimmedCaption.length > 0 ? trimmedCaption : null,
    title: meta.title,
    subtitle: meta.subtitle,
    thumbnailUrl: meta.thumbnailUrl,
    status,
    ipHash,
  });

  // Always a generic success, regardless of published/flagged, so the
  // moderation outcome is never signaled back to the submitter.
  return NextResponse.json({ ok: true });
}
