export type NavLink = {
  label: string;
  href: string;
};

// "Home" is intentionally omitted — the wordmark in the masthead links there.
export const navLinks: NavLink[] = [
  { label: "Projects", href: "/#projects" },
  { label: "Hobbies", href: "/#hobbies" },
  { label: "Guestbook", href: "/guestbook" },
  { label: "Jukebox", href: "/jukebox" },
];

export const site = {
  name: "Your Name",
  masthead: "2026 · Software & Hobbies",
  tagline: "Software engineer, building things and collecting Pokemon cards.",
  bio: "I'm a software engineer interested in building useful, well-crafted things. This site is one of them — a living portfolio with a guestbook, a dashboard of what I'm up to, and a few of my hobbies.",
  socials: [
    { label: "GitHub", href: "https://github.com/your-username" },
    { label: "LinkedIn", href: "https://linkedin.com/in/your-username" },
    { label: "Email", href: "mailto:you@example.com" },
  ],
};
