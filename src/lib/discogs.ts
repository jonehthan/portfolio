export type DiscogsRecord = {
  id: number;
  title: string;
  artist: string;
  year: number | null;
  coverUrl: string;
  url: string;
};

export type DiscogsCollection = {
  profileUrl: string;
  totalRecords: number;
  // Median collection value as Discogs formats it (e.g. "$1,234.56"), or null
  // when the value endpoint isn't available.
  medianValue: string | null;
  recent: DiscogsRecord[];
};

type RawRelease = {
  basic_information: {
    id: number;
    title: string;
    year?: number;
    cover_image?: string;
    thumb?: string;
    artists?: { name: string }[];
  };
};

const API = "https://api.discogs.com";
const RECENT_COUNT = 6;

async function discogsGet<T>(path: string, token: string): Promise<T | null> {
  try {
    const response = await fetch(`${API}${path}`, {
      headers: {
        Authorization: `Discogs token=${token}`,
        // Discogs rejects requests without a descriptive User-Agent.
        "User-Agent": "Portfolio/0.1",
      },
      next: { revalidate: 3_600 },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

// Discogs appends " (2)" style suffixes to disambiguate same-named artists.
function cleanArtist(name: string): string {
  return name.replace(/\s\(\d+\)$/, "");
}

export async function fetchDiscogsCollection(): Promise<DiscogsCollection | null> {
  const token = process.env.DISCOGS_TOKEN;
  const username = process.env.DISCOGS_USERNAME;
  if (!token || !username) return null;

  const user = encodeURIComponent(username);

  const [releases, value] = await Promise.all([
    discogsGet<{
      pagination: { items: number };
      releases: RawRelease[];
    }>(
      `/users/${user}/collection/folders/0/releases?sort=added&sort_order=desc&per_page=${RECENT_COUNT}`,
      token
    ),
    discogsGet<{ median: string }>(`/users/${user}/collection/value`, token),
  ]);

  if (!releases) return null;

  const recent = releases.releases.flatMap((release): DiscogsRecord[] => {
    const info = release.basic_information;
    const coverUrl = info.cover_image || info.thumb;
    if (!coverUrl) return [];
    return [
      {
        id: info.id,
        title: info.title,
        artist: info.artists?.map((artist) => cleanArtist(artist.name)).join(", ") ?? "",
        year: info.year || null,
        coverUrl,
        url: `https://www.discogs.com/release/${info.id}`,
      },
    ];
  });

  return {
    profileUrl: `https://www.discogs.com/user/${user}/collection`,
    totalRecords: releases.pagination.items,
    medianValue: value?.median ?? null,
    recent,
  };
}
