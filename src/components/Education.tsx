import { education } from "@/content/profile";

const labelClass = "mb-1 text-xs uppercase text-[var(--color-muted)]";

export function Education() {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3
          className="text-lg text-[var(--color-ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {education.school}
        </h3>
        <span className="text-xs text-[var(--color-muted)]">{education.graduated}</span>
      </div>
      <p className="text-sm italic text-[var(--color-ink-2)]">
        {education.degrees} · GPA {education.gpa}
      </p>

      <dl className="mt-5 flex flex-col gap-5 text-sm text-[var(--color-ink-2)]">
        <div>
          <dt className={labelClass} style={{ letterSpacing: "0.08em" }}>
            Senior thesis
          </dt>
          <dd>{education.thesis}</dd>
        </div>
        <div>
          <dt className={labelClass} style={{ letterSpacing: "0.08em" }}>
            Political science coursework
          </dt>
          <dd>{education.politicalScience.join(" · ")}</dd>
        </div>
        <div>
          <dt className={labelClass} style={{ letterSpacing: "0.08em" }}>
            Computer science coursework
          </dt>
          <dd>{education.computerScience.join(" · ")}</dd>
        </div>
      </dl>
    </div>
  );
}
