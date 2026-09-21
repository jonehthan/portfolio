// Local, zero-cost moderation: a wordlist check plus a few spam heuristics.
// Deliberately conservative, anything that trips a check is "flagged"
// (hidden, not deleted) rather than rejected outright, so nothing submitted
// in good faith is silently lost and you can review flagged rows later.

// Small, hand-maintained list, tune as needed. Matched as whole words,
// case-insensitively, against both name and message.
const BLOCKED_WORDS = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "cunt",
  "nigger",
  "faggot",
  "retard",
  "whore",
  "slut",
];

const MAX_URLS = 2;
const MAX_LENGTH = { name: 50, message: 500 };
const MIN_MESSAGE_LENGTH = 2;

export type ModerationResult = {
  status: "published" | "flagged";
  reason?: string;
};

function containsBlockedWord(text: string): boolean {
  const lower = text.toLowerCase();
  // Boundary only at the start, catches inflected forms too (e.g. "fucking",
  // "bitches") without requiring an exact whole-word match.
  return BLOCKED_WORDS.some((word) => new RegExp(`\\b${word}`, "i").test(lower));
}

function countUrls(text: string): number {
  const matches = text.match(/https?:\/\/\S+|www\.\S+/gi);
  return matches?.length ?? 0;
}

function isMostlyCaps(text: string): boolean {
  const letters = text.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 8) return false;
  const caps = letters.replace(/[^A-Z]/g, "");
  return caps.length / letters.length > 0.7;
}

function hasExcessiveRepeats(text: string): boolean {
  return /(.)\1{5,}/.test(text);
}

export function moderate(name: string, message: string): ModerationResult {
  if (containsBlockedWord(name) || containsBlockedWord(message)) {
    return { status: "flagged", reason: "blocked-word" };
  }

  if (message.trim().length < MIN_MESSAGE_LENGTH) {
    return { status: "flagged", reason: "too-short" };
  }

  if (countUrls(message) > MAX_URLS || countUrls(name) > 0) {
    return { status: "flagged", reason: "too-many-links" };
  }

  if (isMostlyCaps(message) || hasExcessiveRepeats(message)) {
    return { status: "flagged", reason: "spam-heuristic" };
  }

  return { status: "published" };
}

export function withinLengthLimits(name: string, message: string): boolean {
  return (
    name.trim().length > 0 &&
    name.length <= MAX_LENGTH.name &&
    message.trim().length > 0 &&
    message.length <= MAX_LENGTH.message
  );
}
