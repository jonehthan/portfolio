import type { Project } from "@/content/projects";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <a
      href={project.repoUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col gap-3 p-5 transition-colors hover:bg-[var(--color-paper-2)]"
      style={{ border: "var(--rule-hair) solid var(--color-rule)", borderRadius: "var(--radius-card)" }}
    >
      <span
        className="text-xs text-[var(--color-muted)]"
        style={{ fontFamily: "var(--font-outlier)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3
        className="text-lg text-[var(--color-ink)] group-hover:text-[var(--color-accent)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {project.title}
      </h3>
      <p className="flex-1 text-sm text-[var(--color-ink-2)]">{project.description}</p>
      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs uppercase text-[var(--color-muted)]" style={{ letterSpacing: "0.06em" }}>
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <span className="text-sm text-[var(--color-ink-2)] underline decoration-[var(--color-rule)] underline-offset-2 group-hover:text-[var(--color-accent)] group-hover:decoration-[var(--color-accent)]">
        View repo →
      </span>
    </a>
  );
}

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard key={project.title} project={project} index={index} />
      ))}
    </div>
  );
}
