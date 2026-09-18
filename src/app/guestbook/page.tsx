import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { SectionHeading } from "@/components/SectionHeading";
import { GuestbookWall } from "@/components/GuestbookWall";

export const metadata: Metadata = {
  title: "Guestbook",
};

export const dynamic = "force-dynamic";

export default async function GuestbookPage() {
  const initialEntries = await db
    .select({
      id: messages.id,
      name: messages.name,
      message: messages.message,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(eq(messages.status, "published"))
    .orderBy(desc(messages.createdAt))
    .limit(50);

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <SectionHeading
        title="Guestbook"
        description="Sign the wall — leave a message if you'd like."
      />
      <GuestbookWall
        initialEntries={initialEntries.map((entry) => ({
          ...entry,
          createdAt: entry.createdAt.toISOString(),
        }))}
      />
    </section>
  );
}
