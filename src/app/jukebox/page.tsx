import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { songs } from "@/db/schema";
import { SectionHeading } from "@/components/SectionHeading";
import { PlaceholderSection } from "@/components/PlaceholderSection";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { JukeboxWall } from "@/components/JukeboxWall";
import { curatedSongs } from "@/content/jukebox";

export const metadata: Metadata = {
  title: "Jukebox",
};

export const dynamic = "force-dynamic";

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
    <div className="mx-auto max-w-2xl px-6 py-16">
      <section>
        <SectionHeading
          title="Jukebox"
          description="Songs I'm into, and songs visitors have shared."
        />
        {curatedSongs.length === 0 ? (
          <PlaceholderSection note="No curated picks yet — add some to src/content/jukebox.ts." />
        ) : (
          <ul className="flex flex-col gap-6">
            {curatedSongs.map((song) => (
              <li key={song.spotifyUrl} className="flex flex-col gap-2">
                {song.caption && (
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {song.caption}
                  </p>
                )}
                <SpotifyEmbed url={song.spotifyUrl} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <SectionHeading title="Share a song" />
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
