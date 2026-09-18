export type Project = {
  title: string;
  description: string;
  tags: string[];
  repoUrl: string;
  homepageUrl?: string;
};

// Swap these out for your real projects — each one just needs a repo link.
export const projects: Project[] = [
  {
    title: "Project One",
    description:
      "A short, honest description of what this project does and why you built it.",
    tags: ["TypeScript", "Next.js"],
    repoUrl: "https://github.com/your-username/project-one",
  },
  {
    title: "Project Two",
    description:
      "A short, honest description of what this project does and why you built it.",
    tags: ["Python"],
    repoUrl: "https://github.com/your-username/project-two",
  },
  {
    title: "Project Three",
    description:
      "A short, honest description of what this project does and why you built it.",
    tags: ["Go", "CLI"],
    repoUrl: "https://github.com/your-username/project-three",
  },
];
