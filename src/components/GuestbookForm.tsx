"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const inputStyle = {
  border: "var(--rule-hair) solid var(--color-rule)",
  borderRadius: "var(--radius-input)",
  outline: "2px solid transparent",
  outlineOffset: "1px",
};

export function GuestbookForm({ onSigned }: { onSigned?: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
          name: formData.get("name"),
          message: formData.get("message"),
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
      onSigned?.();
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
        <label htmlFor="message" className="mb-1 block text-sm text-[var(--color-ink)]">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={500}
          rows={3}
          className="w-full resize-y bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] transition-colors hover:bg-[var(--color-paper-2)]"
          style={{ ...inputStyle, minHeight: "6rem" }}
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
        {status === "submitting" ? "Signing…" : "Sign the guestbook"}
      </button>

      <p className="min-h-[1lh] text-sm">
        {status === "success" && (
          <span className="text-[var(--color-ink-2)]">Thanks for signing!</span>
        )}
        {status === "error" && errorMessage && (
          <span style={{ color: "var(--color-error)" }}>{errorMessage}</span>
        )}
      </p>
    </form>
  );
}
