"use client";

import { useState } from "react";
import { JukeboxForm } from "@/components/JukeboxForm";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";

export type JukeboxEntry = {
  id: number;
  name: string;
  spotifyUrl: string;
  caption: string | null;
  createdAt: string;
};

export function JukeboxWall({
  initialEntries,
}: {
  initialEntries: JukeboxEntry[];
}) {
  const [entries, setEntries] = useState(initialEntries);

  async function refresh() {
    try {
      const response = await fetch("/api/jukebox");
      if (!response.ok) return;
      const data = await response.json();
      setEntries(data.songs ?? []);
    } catch {
      // Best-effort refresh — the wall just stays as-is if this fails.
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="rounded-lg border border-black/10 p-6 dark:border-white/10">
        <JukeboxForm onShared={refresh} />
      </div>

      <ul className="flex flex-col gap-6">
        {entries.length === 0 && (
          <li className="text-sm text-black/50 dark:text-white/50">
            No songs shared yet — be the first!
          </li>
        )}
        {entries.map((entry) => (
          <li key={entry.id} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm font-medium">{entry.name}</span>
            </div>
            {entry.caption && (
              <p className="text-sm text-black/70 dark:text-white/70">
                {entry.caption}
              </p>
            )}
            <SpotifyEmbed url={entry.spotifyUrl} />
          </li>
        ))}
      </ul>
    </div>
  );
}
