"use client";

import { useState, type FormEvent } from "react";
import { relativeTime } from "@/lib/relative-time";
import { buttonClass, buttonStyle, inputClass, inputStyle } from "@/components/form-styles";

export type BoardMessage = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

type Status = "idle" | "submitting" | "error";

export function MessageBoard({ initialEntries }: { initialEntries: BoardMessage[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function refresh() {
    try {
      const response = await fetch("/api/guestbook");
      if (!response.ok) return;
      const data = await response.json();
      setEntries(data.messages ?? []);
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
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: formData.get("message"),
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
        <label htmlFor="board-message" className="sr-only">
          Message
        </label>
        <textarea
          id="board-message"
          name="message"
          required
          maxLength={500}
          rows={2}
          placeholder="Leave a message…"
          className={`${inputClass} resize-y`}
          style={{ ...inputStyle, minHeight: "4.5rem" }}
        />

        <label htmlFor="board-name" className="sr-only">
          Your name
        </label>
        <input
          id="board-name"
          name="name"
          type="text"
          required
          maxLength={50}
          placeholder="Your name"
          className={inputClass}
          style={inputStyle}
        />

        {/* Honeypot, off-screen rather than display:none so bots that skip
            hidden fields still fill it. */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="board-website">Website</label>
          <input id="board-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={status === "submitting"}
            className={buttonClass}
            style={buttonStyle}
          >
            {status === "submitting" ? "Posting…" : "Post message"}
          </button>
          <p className="text-sm" role="status">
            {status === "error" && errorMessage && (
              <span style={{ color: "var(--color-error)" }}>{errorMessage}</span>
            )}
          </p>
        </div>
      </form>

      {entries.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)]">No messages yet. Be the first.</p>
      ) : (
        <ul
          className="ml-1 flex flex-col pl-5"
          style={{ borderLeft: "var(--rule-hair) solid var(--color-rule)" }}
        >
          {entries.map((entry, index) => (
            <li key={entry.id} className="relative pb-6 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute top-[0.4rem] h-[9px] w-[9px] rounded-full"
                style={{
                  left: "calc(-1.25rem - 5px)",
                  background: index === 0 ? "var(--color-accent)" : "var(--color-neutral)",
                }}
              />
              <p className="text-sm text-[var(--color-ink)]">
                <span className="font-medium">{entry.name}</span>
                <time
                  dateTime={entry.createdAt}
                  suppressHydrationWarning
                  className="ml-2 text-xs text-[var(--color-muted)]"
                >
                  {relativeTime(entry.createdAt)}
                </time>
              </p>
              <p className="mt-0.5 whitespace-pre-line text-sm text-[var(--color-ink-2)]" style={{ lineHeight: 1.55 }}>
                {entry.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
