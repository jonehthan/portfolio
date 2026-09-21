export type Job = {
  company: string;
  role: string;
  period: string;
  highlights?: string[];
};

export const experience: Job[] = [
  {
    company: "Wiesner English, P.C.",
    role: "Legal Assistant",
    period: "June 2026 – Current",
    highlights: [
      "Filed and served hearing requests and case-status notices with the workers' compensation appeals board and district attorney offices, meeting all filing deadlines.",
      "Coordinated medical evaluation requests and records collection with doctors, insurance adjusters, and opposing counsel, keeping case files complete and current for attorney review.",
      "Conducted client intake and case-status calls, flagging incoming medical evaluation reports and legal filings to keep attorneys informed and cases on schedule.",
    ],
  },
  {
    company: "San Jose State University",
    role: "Instructional Student Assistant",
    period: "August 2025 – May 2026",
    highlights: [
      "Guided students through the Constitutional Amendment research paper process, giving targeted feedback on thesis development, constitutional analysis, and academic writing quality.",
      "Supported instruction for two sections of POLS 15: Essentials of U.S. & California Government, assisting a combined cohort of 200+ students in mastering core political science concepts.",
      "Contributed to improved student quiz performance by leading structured review sessions and emphasizing high-yield course material.",
    ],
  },
  {
    company: "Cadence Design Systems",
    role: "Technical Intern",
    period: "July 2025 – August 2025",
    highlights: [
      "Built and deployed an internal Python automation tool that parsed and converted complex HTML documentation into dynamic PDF reports, using BeautifulSoup, pdfkit, and PyPDF2.",
      "Optimized a full-stack pipeline for technical documentation, automating data retrieval, formatting, and export to improve content delivery speed by 80%.",
      "Delivered documentation infrastructure used by non-technical staff, requiring clear communication across engineering and communications teams.",
      "Collaborated with a cross-functional team of 5 engineers and technical writers, using Git and Agile stand-ups to streamline development and feedback.",
    ],
  },
  {
    company: "theCoderSchool",
    role: "Coding Instructor",
    period: "September 2024 – July 2025",
    highlights: [
      "Taught children ages 7–14 programming fundamentals in Python and Scratch.",
      "Developed personalized lesson plans to fit diverse learning styles and paces, so each student met their coding goals.",
      "Sent parents feedback and progress reports highlighting improvements and celebrating achievements.",
    ],
  },
  {
    company: "District Office of Congressman Ro Khanna",
    role: "Congressional Intern",
    period: "January 2025 – May 2025",
    highlights: [
      "Managed 100+ constituent cases, handling inquiries and expediting requests related to USCIS and the Department of State.",
      "Served as a primary point of contact for constituents, providing information on federal legislation and addressing concerns by phone, in person, and in writing.",
      "Helped organize and facilitate monthly town halls, selecting diverse constituent questions and supporting the Congressman in live Q&A sessions.",
    ],
  },
];

export const activities: Job[] = [
  {
    company: "Mozilla Foundation",
    role: "Lead Ambassador",
    period: "August 2024 – January 2025",
    highlights: [
      "Connected industry professionals with students to advance conversations about ethical AI usage and policy.",
    ],
  },
  {
    company: "Theta Tau",
    role: "Historian",
    period: "August 2024 – January 2025",
    highlights: [
      "Coordinated event logistics, ensuring accurate documentation and timely communication across members and faculty.",
    ],
  },
  {
    company: "Pi Sigma Alpha",
    role: "Secretary",
    period: "August 2024 – May 2025",
    highlights: [
      "Kept concise, detailed meeting notes and scheduled events within the Political Science department faculty.",
    ],
  },
];

export const education = {
  school: "San Jose State University",
  degrees: "B.S. in Computer Science, B.A. in Political Science with Honors",
  graduated: "May 2026",
  gpa: "3.93",
  thesis: "Nuclear Weapons, AI, and Authoritarian Governance",
  politicalScience: [
    "Public Policy",
    "Recent Political Thought",
    "American Political Thought",
    "Political Inquiry",
    "Local Politics",
    "Foreign Policy",
    "Constitutional Law: Civil Liberties",
    "Asian Politics",
  ],
  computerScience: [
    "Advanced Python Programming",
    "Computer Architecture",
    "Data Structures and Algorithms",
    "Formal Languages and Computability",
    "Mobile Device Development",
    "Object-Oriented Programming",
    "Operating Systems",
    "Parallel Processing",
    "Programming Paradigms",
    "Introduction to AI",
    "Information Systems",
    "Database Management Systems",
    "Introduction to Machine Learning",
    "Software Engineering",
  ],
};

export const skills: { label: string; items: string[] }[] = [
  {
    label: "Languages",
    items: ["Python", "Java", "JavaScript", "TypeScript", "C", "C++", "C#", "HTML/CSS", "SQL", "Scheme", "Haskell"],
  },
  {
    label: "Frameworks & libraries",
    items: ["React", "Flask", "Angular", "Pandas", "Matplotlib", "Seaborn", "scikit-learn", "TensorFlow", "PyTorch"],
  },
  {
    label: "Tools & platforms",
    items: ["Westlaw/LexisNexis (independent research)", "Microsoft Office Suite", "Git", "GitHub", "Docker", "Linux", "macOS", "Windows", "Agile/Scrum", "REST APIs", "Hugging Face"],
  },
  {
    label: "Legal & research",
    items: ["Legal Research", "Analytical Research", "Technical Writing", "Information Management", "Case Filing"],
  },
  { label: "Databases", items: ["MySQL", "SQLite", "SQLite-vec"] },
];

export const interests = [
  "Pop music",
  "Pokemon cards",
  "Vinyls",
  "Video games",
  "League of Legends",
  "Pickleball",
  "Blind box hunting",
  "Matcha",
];
