import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {site.name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-black/70 dark:text-white/70">
        {site.tagline}
      </p>
      <p className="mt-4 max-w-2xl text-black/60 dark:text-white/60">
        {site.bio}
      </p>
    </section>
  );
}
