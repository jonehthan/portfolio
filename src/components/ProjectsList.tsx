import type { Project } from "@/content/projects";

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <li
      className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2 py-6 first:pt-0 last:pb-0"
      style={index > 0 ? { borderTop: "var(--rule-hair) solid var(--color-rule)" } : undefined}
    >
      <span
        aria-hidden="true"
        className="pt-1 text-xs text-[var(--color-muted)]"
        style={{ fontFamily: "var(--font-outlier)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <h3
            className="text-lg text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.title}
          </h3>
          <span className="text-xs text-[var(--color-muted)]">{project.period}</span>
        </div>

        <p className="mt-2 text-sm text-[var(--color-ink-2)]" style={{ lineHeight: 1.6 }}>
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <ul
            className="flex flex-wrap gap-x-3 gap-y-1 text-xs uppercase text-[var(--color-muted)]"
            style={{ letterSpacing: "0.06em" }}
          >
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[var(--color-ink-2)] underline decoration-[var(--color-rule)] underline-offset-4 transition-colors hover:text-[var(--color-accent)] hover:decoration-[var(--color-accent)]"
            >
              View repo →
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

export function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <ol className="flex flex-col">
      {projects.map((project, index) => (
        <ProjectRow key={project.title} project={project} index={index} />
      ))}
    </ol>
  );
}
