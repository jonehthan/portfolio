"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const inputStyle = {
  border: "var(--rule-hair) solid var(--color-rule)",
  borderRadius: "var(--radius-input)",
  outline: "2px solid transparent",
  outlineOffset: "1px",
};

export function JukeboxForm({ onShared }: { onShared?: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
          name: formData.get("name"),
          spotifyUrl: formData.get("spotifyUrl"),
          caption: formData.get("caption"),
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
      setStatus("success");
      onShared?.();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-[var(--color-ink)]">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={50}
          className="w-full bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] transition-colors hover:bg-[var(--color-paper-2)]"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="spotifyUrl" className="mb-1 block text-sm text-[var(--color-ink)]">
          Spotify link
        </label>
        <input
          id="spotifyUrl"
          name="spotifyUrl"
          type="url"
          required
          placeholder="https://open.spotify.com/track/…"
          className="w-full bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] transition-colors hover:bg-[var(--color-paper-2)]"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="caption" className="mb-1 block text-sm text-[var(--color-ink)]">
          Caption (optional)
        </label>
        <input
          id="caption"
          name="caption"
          type="text"
          maxLength={300}
          className="w-full bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] transition-colors hover:bg-[var(--color-paper-2)]"
          style={inputStyle}
        />
      </div>

      {/* Honeypot — hidden from real visitors, left off-screen instead of
          display:none so it's invisible without looking suspicious to bots
          that skip display:none fields. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-11 items-center gap-2 self-start px-5 text-sm text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] disabled:opacity-50"
        style={{ border: "var(--rule-hair) solid var(--color-ink)", borderRadius: "var(--radius-input)" }}
      >
        {status === "submitting" ? "Sharing…" : "Share a song"}
      </button>

      <p className="min-h-[1lh] text-sm">
        {status === "success" && (
          <span className="text-[var(--color-ink-2)]">Thanks for sharing!</span>
        )}
        {status === "error" && errorMessage && (
          <span style={{ color: "var(--color-error)" }}>{errorMessage}</span>
        )}
      </p>
    </form>
  );
}
