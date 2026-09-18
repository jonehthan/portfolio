import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { dashboardSnapshots } from "@/db/schema";
import type { GithubSnapshot } from "@/lib/github";
import type { SpotifySnapshot } from "@/lib/spotify";
import { PlaceholderSection } from "@/components/PlaceholderSection";

async function getLatest<T>(source: "github" | "spotify"): Promise<T | null> {
  const [row] = await db
    .select({ data: dashboardSnapshots.data })
    .from(dashboardSnapshots)
    .where(eq(dashboardSnapshots.source, source))
    .orderBy(desc(dashboardSnapshots.fetchedAt))
    .limit(1);

  return (row?.data as T | undefined) ?? null;
}

function GithubCard({ data }: { data: GithubSnapshot }) {
  return (
    <div className="rounded-lg border border-black/10 p-5 dark:border-white/10">
      <h3 className="font-medium">GitHub</h3>
      <p className="mt-2 text-sm text-black/70 dark:text-white/70">
        {data.totalContributions} contributions in the last year
      </p>
      {data.topLanguages.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {data.topLanguages.map((language) => (
            <li
              key={language}
              className="rounded-full bg-black/5 px-2.5 py-1 text-xs text-black/70 dark:bg-white/10 dark:text-white/70"
            >
              {language}
            </li>
          ))}
        </ul>
      )}
      {data.recentRepos.length > 0 && (
        <ul className="mt-4 flex flex-col gap-1.5 text-sm">
          {data.recentRepos.map((repo) => (
            <li key={repo.url}>
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="text-black/70 underline-offset-2 hover:underline dark:text-white/70"
              >
                {repo.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SpotifyCard({ data }: { data: SpotifySnapshot }) {
  const track = data.track;

  if (!track) {
    return (
      <div className="rounded-lg border border-black/10 p-5 dark:border-white/10">
        <h3 className="font-medium">Spotify</h3>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          No listening activity yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-black/10 p-5 dark:border-white/10">
      <h3 className="font-medium">Spotify</h3>
      <p className="mt-2 text-xs text-black/50 dark:text-white/50">
        {data.isPlaying ? "Now playing" : "Last played"}
      </p>
      <a
        href={track.url}
        target="_blank"
        rel="noreferrer"
        className="mt-2 flex items-center gap-3 hover:underline"
      >
        {track.albumArt && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.albumArt}
            alt=""
            className="h-12 w-12 rounded-md object-cover"
          />
        )}
        <span className="text-sm">
          <span className="block font-medium">{track.name}</span>
          <span className="block text-black/60 dark:text-white/60">
            {track.artist}
          </span>
        </span>
      </a>
    </div>
  );
}

export async function DashboardSection() {
  const [github, spotify] = await Promise.all([
    getLatest<GithubSnapshot>("github"),
    getLatest<SpotifySnapshot>("spotify"),
  ]);

  if (!github && !spotify) {
    return (
      <PlaceholderSection note="No data yet — this fills in after the first refresh runs." />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {github && <GithubCard data={github} />}
      {spotify && <SpotifyCard data={spotify} />}
    </div>
  );
}
