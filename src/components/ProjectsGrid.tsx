import type { Project } from "@/content/projects";

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.repoUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col rounded-lg border border-black/10 p-5 transition-colors hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
    >
      <h3 className="font-medium group-hover:underline">{project.title}</h3>
      <p className="mt-2 flex-1 text-sm text-black/60 dark:text-white/60">
        {project.description}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-black/5 px-2.5 py-1 text-xs text-black/70 dark:bg-white/10 dark:text-white/70"
          >
            {tag}
          </li>
        ))}
      </ul>
    </a>
  );
}

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
    </div>
  );
}
