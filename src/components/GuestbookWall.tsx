"use client";

import { useState } from "react";
import { GuestbookForm } from "@/components/GuestbookForm";

export type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function GuestbookWall({
  initialEntries,
}: {
  initialEntries: GuestbookEntry[];
}) {
  const [entries, setEntries] = useState(initialEntries);

  async function refresh() {
    try {
      const response = await fetch("/api/guestbook");
      if (!response.ok) return;
      const data = await response.json();
      setEntries(data.messages ?? []);
    } catch {
      // Best-effort refresh — the wall just stays as-is if this fails.
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="rounded-lg border border-black/10 p-6 dark:border-white/10">
        <GuestbookForm onSigned={refresh} />
      </div>

      <ul className="flex flex-col gap-4">
        {entries.length === 0 && (
          <li className="text-sm text-black/50 dark:text-white/50">
            No one&rsquo;s signed yet — be the first!
          </li>
        )}
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="rounded-lg border border-black/10 p-4 dark:border-white/10"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-medium">{entry.name}</span>
              <span className="text-xs text-black/40 dark:text-white/40">
                {formatDate(entry.createdAt)}
              </span>
            </div>
            <p className="mt-1 text-sm text-black/70 dark:text-white/70">
              {entry.message}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
