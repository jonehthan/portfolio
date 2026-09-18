"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

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
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={50}
          className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/15 dark:bg-transparent dark:focus:border-white/40"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={500}
          rows={3}
          className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/15 dark:bg-transparent dark:focus:border-white/40"
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
        className="self-start rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {status === "submitting" ? "Signing..." : "Sign the guestbook"}
      </button>

      {status === "success" && (
        <p className="text-sm text-black/60 dark:text-white/60">
          Thanks for signing!
        </p>
      )}
      {status === "error" && errorMessage && (
        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
    </form>
  );
}
