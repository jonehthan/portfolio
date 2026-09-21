import { createHash } from "node:crypto";

const SALT = process.env.IP_HASH_SALT ?? "portfolio-guestbook";

// Salted, one-way hash of the submitter's IP, used only for the rate-limit
// cooldown check. The raw IP is never stored.
export function hashIp(ip: string): string {
  return createHash("sha256").update(`${SALT}:${ip}`).digest("hex");
}
