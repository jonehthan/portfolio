import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-black/60 dark:text-white/60">
        <p>
          &copy; {new Date().getFullYear()} {site.name}
        </p>
        <ul className="flex gap-x-6">
          {site.socials.map((social) => (
            <li key={social.href}>
              <a
                href={social.href}
                className="transition-colors hover:text-black dark:hover:text-white"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
