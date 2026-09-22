export type NavSection = {
  id: string;
  label: string;
};

// Mirrors the section ids rendered in src/app/page.tsx, in page order.
export const navSections: NavSection[] = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "activities", label: "Activities" },
  { id: "skills", label: "Skills & interests" },
  { id: "hobbies", label: "Hobbies" },
  { id: "records", label: "Record collection" },
  { id: "dashboard", label: "Living dashboard" },
  { id: "messages", label: "Message board" },
  { id: "songs", label: "Songs & playlists" },
];
