import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { messages, songs } from "@/db/schema";

const LIMIT = 50;

export async function getPublishedMessages() {
  const rows = await db
    .select({
      id: messages.id,
      name: messages.name,
      message: messages.message,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(eq(messages.status, "published"))
    .orderBy(desc(messages.createdAt))
    .limit(LIMIT);

  return rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() }));
}

export async function getPublishedSongs() {
  const rows = await db
    .select({
      id: songs.id,
      name: songs.name,
      spotifyUrl: songs.spotifyUrl,
      caption: songs.caption,
      title: songs.title,
      subtitle: songs.subtitle,
      thumbnailUrl: songs.thumbnailUrl,
      createdAt: songs.createdAt,
    })
    .from(songs)
    .where(eq(songs.status, "published"))
    .orderBy(desc(songs.createdAt))
    .limit(LIMIT);

  return rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() }));
}
