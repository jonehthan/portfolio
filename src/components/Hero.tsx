import type { CSSProperties } from "react";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="reveal mx-auto max-w-4xl px-6 py-16 sm:py-20" style={{ "--i": 0 } as CSSProperties}>
      <h1
        className="max-w-2xl text-2xl leading-snug text-[var(--color-ink)] sm:text-3xl"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
      >
        {site.tagline}
      </h1>
      <p className="mt-4 max-w-xl text-[var(--color-ink-2)]" style={{ maxWidth: "65ch" }}>
        {site.bio}
      </p>
    </section>
  );
}
