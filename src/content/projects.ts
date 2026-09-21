export type Project = {
  title: string;
  period: string;
  description: string;
  tags: string[];
  repoUrl?: string;
};

export const projects: Project[] = [
  {
    title: "Spotify Popularity Predictor",
    period: "December 2025",
    description:
      "A multi-layer perceptron that predicts song popularity on an imbalanced Spotify dataset (~78% non-popular), using class weighting and PR-AUC as the primary metric. A search across 1,080 configurations found the best architecture, and keeping the original features beat PCA, which discarded class-discriminative low-variance signal.",
    tags: ["Python", "TensorFlow", "scikit-learn", "Pandas"],
  },
  {
    title: "Flavor Feed",
    period: "August – December 2025",
    description:
      "A multi-user social recipe-sharing web app. I led the full stack: system architecture, RESTful API, and database schema, a responsive React frontend with real-time updates, and Flask + MySQL services tuned for concurrent users.",
    tags: ["React", "Flask", "MySQL"],
    repoUrl: "https://github.com/jonehthan/Flavor-Feed",
  },
  {
    title: "Taskify",
    period: "January – May 2025",
    description:
      "A Python task management app with SQLite persistence and Matplotlib analytics that show productivity trends, built from client requirements and shipped with 90% user satisfaction.",
    tags: ["Python", "SQLite", "Matplotlib"],
    repoUrl: "https://github.com/ebaonguyen/TaskManager",
  },
];
