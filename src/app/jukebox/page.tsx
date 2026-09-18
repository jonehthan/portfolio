import type { Metadata } from "next";
import type { ReactNode } from "react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { songs } from "@/db/schema";
import { PlaceholderSection } from "@/components/PlaceholderSection";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { JukeboxWall } from "@/components/JukeboxWall";
import { curatedSongs } from "@/content/jukebox";

export const metadata: Metadata = {
  title: "Jukebox",
};

export const dynamic = "force-dynamic";

function Label({ children }: { children: ReactNode }) {
  return (
    <p
      className="mb-4 text-xs uppercase text-[var(--color-muted)]"
      style={{ letterSpacing: "0.08em" }}
    >
      {children}
    </p>
  );
}

export default async function JukeboxPage() {
  const initialEntries = await db
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

  return (
    <div className="mx-auto px-6 py-16" style={{ maxWidth: "50ch" }}>
      <p
        className="text-2xl italic text-[var(--color-ink)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Dear visitor,
      </p>
      <p className="mt-4 text-[var(--color-ink-2)]">
        Songs I&rsquo;m into, and songs visitors have shared. Add your own
        below.
      </p>

      <section className="mt-12">
        <Label>Curated</Label>
        {curatedSongs.length === 0 ? (
          <PlaceholderSection note="No curated picks yet — add some to src/content/jukebox.ts." />
        ) : (
          <ul className="flex flex-col gap-8">
            {curatedSongs.map((song) => (
              <li key={song.spotifyUrl} className="flex flex-col gap-2">
                {song.caption && (
                  <p className="text-sm text-[var(--color-ink-2)]">{song.caption}</p>
                )}
                <SpotifyEmbed url={song.spotifyUrl} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <Label>Share a song</Label>
        <JukeboxWall
          initialEntries={initialEntries.map((entry) => ({
            ...entry,
            createdAt: entry.createdAt.toISOString(),
          }))}
        />
      </section>
    </div>
  );
}
