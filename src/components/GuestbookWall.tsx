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
    <div className="flex flex-col gap-12">
      <GuestbookForm onSigned={refresh} />

      <ul className="flex flex-col">
        {entries.length === 0 && (
          <li className="text-sm text-[var(--color-muted)]">
            No one&rsquo;s signed yet — be the first.
          </li>
        )}
        {entries.map((entry, index) => (
          <li
            key={entry.id}
            className="py-4"
            style={
              index > 0 ? { borderTop: "var(--rule-hair) solid var(--color-rule)" } : undefined
            }
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[var(--color-ink)]">{entry.name}</span>
              <span className="text-xs text-[var(--color-muted)]">
                {formatDate(entry.createdAt)}
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--color-ink-2)]">{entry.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
