import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dashboardSnapshots } from "@/db/schema";
import { fetchGithubSnapshot } from "@/lib/github";
import { fetchSpotifySnapshot } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await Promise.allSettled([
    fetchGithubSnapshot(),
    fetchSpotifySnapshot(),
  ]);

  const [githubResult, spotifyResult] = results;
  const inserted: string[] = [];
  const errors: Record<string, string> = {};

  if (githubResult.status === "fulfilled") {
    await db.insert(dashboardSnapshots).values({
      source: "github",
      data: githubResult.value,
    });
    inserted.push("github");
  } else {
    errors.github = String(githubResult.reason);
  }

  if (spotifyResult.status === "fulfilled") {
    await db.insert(dashboardSnapshots).values({
      source: "spotify",
      data: spotifyResult.value,
    });
    inserted.push("spotify");
  } else {
    errors.spotify = String(spotifyResult.reason);
  }

  return NextResponse.json({ inserted, errors });
}
