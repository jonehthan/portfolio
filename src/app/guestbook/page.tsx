import type { Metadata } from "next";
import { PlaceholderSection } from "@/components/PlaceholderSection";

export const metadata: Metadata = {
  title: "Guestbook",
};

export default function GuestbookPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <PlaceholderSection
        title="Guestbook"
        description="Sign the wall — leave a message if you'd like."
        note="Coming soon — this page goes live once the guestbook is wired up to the database, with automated moderation on submissions."
      />
    </section>
  );
}
