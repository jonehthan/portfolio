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
    <div className="flex flex-col gap-12">
      <JukeboxForm onShared={refresh} />

      <ul className="flex flex-col gap-8">
        {entries.length === 0 && (
          <li className="text-sm text-[var(--color-muted)]">
            No songs shared yet — be the first.
          </li>
        )}
        {entries.map((entry, index) => (
          <li
            key={entry.id}
            className="flex flex-col gap-2 pt-6"
            style={
              index > 0 ? { borderTop: "var(--rule-hair) solid var(--color-rule)" } : undefined
            }
          >
            <span className="text-sm text-[var(--color-ink)]">{entry.name}</span>
            {entry.caption && (
              <p className="text-sm text-[var(--color-ink-2)]">{entry.caption}</p>
            )}
            <SpotifyEmbed url={entry.spotifyUrl} />
          </li>
        ))}
      </ul>
    </div>
  );
}
