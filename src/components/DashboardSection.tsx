import type { ReactNode } from "react";
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

function Card({ children }: { children: ReactNode }) {
  return (
    <div
      className="p-5"
      style={{ border: "var(--rule-hair) solid var(--color-rule)", borderRadius: "var(--radius-card)" }}
    >
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: ReactNode }) {
  return (
    <h3
      className="text-xs uppercase text-[var(--color-muted)]"
      style={{ letterSpacing: "0.08em" }}
    >
      {children}
    </h3>
  );
}

function GithubCard({ data }: { data: GithubSnapshot }) {
  return (
    <Card>
      <CardLabel>GitHub</CardLabel>
      <p
        className="mt-2 text-3xl text-[var(--color-ink)]"
        style={{ fontFamily: "var(--font-outlier)", fontVariantNumeric: "tabular-nums" }}
      >
        {data.totalContributions}
      </p>
      <p className="text-sm text-[var(--color-ink-2)]">contributions in the last year</p>
      {data.topLanguages.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs uppercase text-[var(--color-muted)]" style={{ letterSpacing: "0.06em" }}>
          {data.topLanguages.map((language) => (
            <li key={language}>{language}</li>
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
                className="text-[var(--color-ink-2)] underline decoration-[var(--color-rule)] underline-offset-2 hover:text-[var(--color-accent)] hover:decoration-[var(--color-accent)]"
              >
                {repo.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function SpotifyCard({ data }: { data: SpotifySnapshot }) {
  const track = data.track;

  if (!track) {
    return (
      <Card>
        <CardLabel>Spotify</CardLabel>
        <p className="mt-2 text-sm text-[var(--color-muted)]">No listening activity yet.</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardLabel>{data.isPlaying ? "Now playing" : "Last played"}</CardLabel>
      <a
        href={track.url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 flex items-center gap-3 group"
      >
        {track.albumArt && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.albumArt}
            alt=""
            className="h-14 w-14 object-cover"
            style={{ borderRadius: "var(--radius-card)" }}
          />
        )}
        <span className="text-sm">
          <span className="block text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
            {track.name}
          </span>
          <span className="block text-[var(--color-ink-2)]">{track.artist}</span>
        </span>
      </a>
    </Card>
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
