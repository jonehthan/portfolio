import { interests, skills } from "@/content/profile";

const labelClass = "mb-1 text-xs uppercase text-[var(--color-muted)]";

export function Skills() {
  return (
    <dl className="flex flex-col gap-5 text-sm text-[var(--color-ink-2)]">
      {skills.map((group) => (
        <div key={group.label}>
          <dt className={labelClass} style={{ letterSpacing: "0.08em" }}>
            {group.label}
          </dt>
          <dd>{group.items.join(" · ")}</dd>
        </div>
      ))}
      <div>
        <dt className={labelClass} style={{ letterSpacing: "0.08em" }}>
          Interests
        </dt>
        <dd>{interests.join(" · ")}</dd>
      </div>
    </dl>
  );
}
