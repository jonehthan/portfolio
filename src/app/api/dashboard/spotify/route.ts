import { NextResponse } from "next/server";
import { getSpotifySnapshot } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

// Public read of the current Spotify state for the dashboard's 30-second
// check. Spotify itself is only queried at most once per cache window.
export async function GET() {
  const snapshot = await getSpotifySnapshot();
  return NextResponse.json(snapshot, { headers: { "Cache-Control": "no-store" } });
}
