import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
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
    <section className="mx-auto px-6 py-16" style={{ maxWidth: "50ch" }}>
      <p
        className="text-2xl italic text-[var(--color-ink)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Dear visitor,
      </p>
      <p className="mt-4 text-[var(--color-ink-2)]">
        Sign the wall — leave a message if you&rsquo;d like. It doesn&rsquo;t
        have to be profound; a hello is plenty.
      </p>

      <div className="mt-10">
        <GuestbookWall
          initialEntries={initialEntries.map((entry) => ({
            ...entry,
            createdAt: entry.createdAt.toISOString(),
          }))}
        />
      </div>
    </section>
  );
}
