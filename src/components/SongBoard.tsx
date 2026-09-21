"use client";

import { useState, type FormEvent } from "react";
import { parseSpotifyUrl } from "@/lib/spotify-url";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { buttonClass, buttonStyle, inputClass, inputStyle } from "@/components/form-styles";

export type BoardSong = {
  id: number;
  name: string;
  spotifyUrl: string;
  caption: string | null;
  title: string | null;
  subtitle: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
};

type Status = "idle" | "submitting" | "error";

function SongRow({ entry, first }: { entry: BoardSong; first: boolean }) {
  const [open, setOpen] = useState(false);
  const type = parseSpotifyUrl(entry.spotifyUrl)?.type ?? "track";
  const title = entry.title ?? `Spotify ${type === "track" ? "song" : type}`;
  const subtitle = entry.subtitle ?? (type === "track" ? "Song" : type === "album" ? "Album" : "Playlist");

  return (
    <li
      className={first ? "pb-5" : "py-5"}
      style={first ? undefined : { borderTop: "var(--rule-hair) solid var(--color-rule)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={`${open ? "Close" : "Play"} ${title}`}
        className="group flex w-full items-center gap-3 text-left"
      >
        {entry.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.thumbnailUrl}
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 flex-none object-cover"
            style={{ borderRadius: "var(--radius-input)" }}
          />
        ) : (
          <span
            aria-hidden="true"
            className="h-11 w-11 flex-none bg-[var(--color-paper-2)]"
            style={{ borderRadius: "var(--radius-input)" }}
          />
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
            {title}
          </span>
          <span className="block truncate text-sm text-[var(--color-muted)]">{subtitle}</span>
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-none text-[var(--color-ink-2)] group-hover:text-[var(--color-accent)]"
        >
          {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M6 4l10 6-10 6z" />}
        </svg>
      </button>

      {open && (
        <div className="mt-3">
          <SpotifyEmbed url={entry.spotifyUrl} />
        </div>
      )}

      {entry.caption ? (
        <p className="mt-2 text-sm text-[var(--color-ink-2)]" style={{ lineHeight: 1.5 }}>
          <span className="italic" style={{ fontFamily: "var(--font-display)" }}>
            &ldquo;{entry.caption}&rdquo;
          </span>
          <span className="ml-2 text-xs text-[var(--color-muted)]">{entry.name}</span>
        </p>
      ) : (
        <p className="mt-2 text-xs text-[var(--color-muted)]">Shared by {entry.name}</p>
      )}
    </li>
  );
}

export function SongBoard({ initialEntries }: { initialEntries: BoardSong[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function refresh() {
    try {
      const response = await fetch("/api/jukebox");
      if (!response.ok) return;
      const data = await response.json();
      setEntries(data.songs ?? []);
    } catch {
      // Best-effort, the board just stays as-is if this fails.
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/jukebox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spotifyUrl: formData.get("spotifyUrl"),
          caption: formData.get("caption"),
          name: formData.get("name"),
          website: formData.get("website"),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setErrorMessage(data?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("idle");
      await refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="song-url" className="sr-only">
          Spotify link
        </label>
        <input
          id="song-url"
          name="spotifyUrl"
          type="url"
          required
          placeholder="Paste a Spotify song, album or playlist link…"
          className={inputClass}
          style={inputStyle}
        />

        <label htmlFor="song-caption" className="sr-only">
          Comment (optional)
        </label>
        <textarea
          id="song-caption"
          name="caption"
          maxLength={300}
          rows={2}
          placeholder="Add a comment (optional)"
          className={`${inputClass} resize-y`}
          style={{ ...inputStyle, minHeight: "3rem" }}
        />

        <label htmlFor="song-name" className="sr-only">
          Your name
        </label>
        <input
          id="song-name"
          name="name"
          type="text"
          required
          maxLength={50}
          placeholder="Your name"
          className={inputClass}
          style={inputStyle}
        />

        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="song-website">Website</label>
          <input id="song-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={status === "submitting"}
            className={buttonClass}
            style={buttonStyle}
          >
            {status === "submitting" ? "Sharing…" : "Share"}
          </button>
          <p className="text-sm" role="status">
            {status === "error" && errorMessage && (
              <span style={{ color: "var(--color-error)" }}>{errorMessage}</span>
            )}
          </p>
        </div>
      </form>

      {entries.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)]">Nothing shared yet. Be the first.</p>
      ) : (
        <ul className="flex flex-col">
          {entries.map((entry, index) => (
            <SongRow key={entry.id} entry={entry} first={index === 0} />
          ))}
        </ul>
      )}
    </div>
  );
}
