import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mx-auto px-6 py-16" style={{ maxWidth: "60ch" }}>
      <p
        className="text-lg italic text-[var(--color-ink)]"
        style={{ fontFamily: "var(--font-display)", lineHeight: 1.4 }}
      >
        Yours,
        <br />
        <span className="not-italic font-semibold">{site.name}</span>
      </p>
      <p className="mt-4 text-sm text-[var(--color-muted)]">
        P.S. Say{" "}
        <Link href="/#messages" className="text-[var(--color-ink-2)] underline decoration-[var(--color-rule)] underline-offset-2 hover:text-[var(--color-accent)]">
          hello
        </Link>
        , or add your favorite{" "}
        <Link href="/#songs" className="text-[var(--color-ink-2)] underline decoration-[var(--color-rule)] underline-offset-2 hover:text-[var(--color-accent)]">
          song, playlist, or album
        </Link>
        .
      </p>
      <ul className="mt-6 flex gap-x-6 text-xs uppercase text-[var(--color-muted)]" style={{ letterSpacing: "0.08em" }}>
        {site.socials.map((social) => (
          <li key={social.href}>
            <a
              href={social.href}
              className="whitespace-nowrap hover:text-[var(--color-accent)]"
            >
              {social.label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
