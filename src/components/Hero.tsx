import type { CSSProperties } from "react";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="reveal py-16 sm:py-20" style={{ "--i": 0 } as CSSProperties}>
      <h1
        className="max-w-2xl text-2xl leading-snug text-[var(--color-ink)] sm:text-3xl"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
      >
        {site.tagline}
      </h1>
      <p className="mt-4 max-w-xl text-[var(--color-ink-2)]" style={{ maxWidth: "65ch" }}>
        {site.bio}
      </p>
      <ul
        className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm"
        aria-label="Elsewhere"
      >
        {site.socials.map((social) => (
          <li key={social.href}>
            <a
              href={social.href}
              className="whitespace-nowrap text-[var(--color-ink-2)] underline decoration-[var(--color-rule)] underline-offset-4 transition-colors hover:text-[var(--color-accent)]"
            >
              {social.label} →
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
