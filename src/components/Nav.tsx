import Link from "next/link";
import { navLinks, site } from "@/content/site";

export function Nav() {
  return (
    <header className="px-6 pt-4">
      <div className="mx-auto grid max-w-4xl gap-2 text-center">
        <p
          className="text-xs uppercase text-[var(--color-muted)]"
          style={{ letterSpacing: "0.08em", fontVariant: "small-caps" }}
        >
          {site.masthead}
        </p>
        <Link
          href="/"
          className="text-4xl leading-none text-[var(--color-ink)] sm:text-5xl"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
        >
          {site.name}
        </Link>
        <nav aria-label="Primary" className="mt-1">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="whitespace-nowrap text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-accent)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <hr
          aria-hidden="true"
          className="mt-3 border-0"
          style={{
            borderTop: "var(--rule-hair) solid var(--color-rule)",
            borderBottom: "var(--rule-hair) solid var(--color-rule)",
            height: "4px",
          }}
        />
      </div>
    </header>
  );
}
