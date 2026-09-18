import type { Metadata } from "next";
import { PlaceholderSection } from "@/components/PlaceholderSection";

export const metadata: Metadata = {
  title: "Jukebox",
};

export default function JukeboxPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <PlaceholderSection
        title="Jukebox"
        description="Songs I'm into, and songs visitors have shared."
        note="Coming soon — share a Spotify link and it'll show up here as a playable embed."
      />
    </section>
  );
}
