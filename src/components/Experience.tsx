import type { Job } from "@/content/profile";

export function Experience({ jobs }: { jobs: Job[] }) {
  return (
    <ul className="flex flex-col gap-10">
      {jobs.map((job) => (
        <li key={job.company}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3
              className="text-lg text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {job.company}
            </h3>
            <span className="text-xs text-[var(--color-muted)]">{job.period}</span>
          </div>
          <p className="text-sm italic text-[var(--color-ink-2)]">{job.role}</p>
          {job.highlights && (
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm text-[var(--color-ink-2)] marker:text-[var(--color-neutral)]">
              {job.highlights.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
