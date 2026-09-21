import type { ReactNode } from "react";
import type { GithubSnapshot } from "@/lib/github";
import { getLatestSnapshot, getSpotifySnapshot } from "@/lib/dashboard";
import { NowSpinning } from "@/components/NowSpinning";
import { PlaceholderSection } from "@/components/PlaceholderSection";

function LedgerRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className="flex items-baseline gap-3 py-3 first:pt-0 last:border-b-0"
      style={{ borderBottom: "var(--rule-hair) solid var(--color-rule)" }}
    >
      <dt
        className="flex-none text-xs uppercase text-[var(--color-muted)]"
        style={{ letterSpacing: "0.08em" }}
      >
        {label}
      </dt>
      <span
        aria-hidden="true"
        className="min-w-4 flex-1"
        style={{
          borderBottom: "1px dotted var(--color-neutral)",
          transform: "translateY(-3px)",
        }}
      />
      <dd className="max-w-[65%] text-right text-sm text-[var(--color-ink)]">
        {children}
      </dd>
    </div>
  );
}

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
