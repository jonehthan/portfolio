export type GithubSnapshot = {
  totalContributions: number;
  topLanguages: string[];
  recentRepos: { name: string; url: string; language: string | null }[];
};

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
        }
      }
      repositories(
        first: 5
        orderBy: { field: PUSHED_AT, direction: DESC }
        ownerAffiliations: OWNER
        privacy: PUBLIC
        isFork: false
      ) {
        nodes {
          name
          url
          primaryLanguage {
            name
          }
        }
      }
    }
  }
`;

export async function fetchGithubSnapshot(): Promise<GithubSnapshot> {
  const token = process.env.GITHUB_TOKEN;
  const login = process.env.GITHUB_USERNAME;

  if (!token || !login) {
    throw new Error("GITHUB_TOKEN or GITHUB_USERNAME is not set");
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(`GitHub GraphQL error: ${JSON.stringify(json.errors)}`);
  }

  const user = json.data.user;
  const nodes: { name: string; url: string; primaryLanguage: { name: string } | null }[] =
    user.repositories.nodes;

  const languageCounts = new Map<string, number>();
  for (const node of nodes) {
    const language = node.primaryLanguage?.name;
    if (language) {
      languageCounts.set(language, (languageCounts.get(language) ?? 0) + 1);
    }
  }
  const topLanguages = [...languageCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([language]) => language);

  return {
    totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
    topLanguages,
    recentRepos: nodes.map((node) => ({
      name: node.name,
      url: node.url,
      language: node.primaryLanguage?.name ?? null,
    })),
  };
}
