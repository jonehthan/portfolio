import type { GithubSnapshot } from "@/lib/github";
import { getLatestSnapshot, getSpotifySnapshot } from "@/lib/dashboard";
import { LedgerRow } from "@/components/LedgerRow";
import { NowSpinning } from "@/components/NowSpinning";
import { PlaceholderSection } from "@/components/PlaceholderSection";

function GithubLedger({ data }: { data: GithubSnapshot }) {
  return (
    <dl>
      <LedgerRow label="Contributions">
        <span
          style={{
            fontFamily: "var(--font-outlier)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {data.totalContributions}
        </span>{" "}
        <span className="text-[var(--color-ink-2)]">in the last year</span>
      </LedgerRow>

      {data.topLanguages.length > 0 && (
        <LedgerRow label="Top languages">
          {data.topLanguages.join(", ")}
        </LedgerRow>
      )}

      {data.recentRepos.length > 0 && (
        <LedgerRow label="Recent work">
          {data.recentRepos.map((repo, index) => (
            <span key={repo.url}>
              {index > 0 && ", "}
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-[var(--color-rule)] underline-offset-2 hover:text-[var(--color-accent)] hover:decoration-[var(--color-accent)]"
              >
                {repo.name}
              </a>
            </span>
          ))}
        </LedgerRow>
      )}
    </dl>
  );
}

export async function DashboardSection() {
  const [github, spotify] = await Promise.all([
    getLatestSnapshot<GithubSnapshot>("github"),
    getSpotifySnapshot(),
  ]);

  if (!github && !spotify) {
    return (
      <PlaceholderSection note="No data yet. This fills in after the first refresh runs." />
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {github && <GithubLedger data={github} />}
      {spotify && <NowSpinning initial={spotify} />}
    </div>
  );
}
