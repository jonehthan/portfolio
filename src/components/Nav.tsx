import Link from "next/link";
import { site } from "@/content/site";

export function Nav() {
  return (
    <header className="px-6 pt-4">
      <div className="mx-auto grid max-w-6xl gap-2 text-center">
        <p
          className="px-24 text-xs uppercase text-[var(--color-muted)] sm:px-0"
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
