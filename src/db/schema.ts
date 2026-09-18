import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  message: text("message").notNull(),
  status: text("status", { enum: ["published", "flagged"] }).notNull(),
  ipHash: text("ip_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
