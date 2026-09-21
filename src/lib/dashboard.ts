import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { dashboardSnapshots } from "@/db/schema";
import { getLiveSpotifySnapshot, type SpotifySnapshot } from "@/lib/spotify";

export async function getLatestSnapshot<T>(source: "github" | "spotify"): Promise<T | null> {
  const [row] = await db
    .select({ data: dashboardSnapshots.data })
    .from(dashboardSnapshots)
    .where(eq(dashboardSnapshots.source, source))
    .orderBy(desc(dashboardSnapshots.fetchedAt))
    .limit(1);

  return (row?.data as T | undefined) ?? null;
}

// Live from Spotify when possible (so "Now playing" is real); otherwise the
// last snapshot the daily refresh saved.
export async function getSpotifySnapshot(): Promise<SpotifySnapshot | null> {
  try {
    return await getLiveSpotifySnapshot();
  } catch {
    return getLatestSnapshot<SpotifySnapshot>("spotify");
  }
}
