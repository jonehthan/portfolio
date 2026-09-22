export type DiscogsRecord = {
  id: number;
  title: string;
  artist: string;
  year: number | null;
  coverUrl: string;
  url: string;
  // Current lowest Discogs marketplace listing for this release, in the
  // currency Discogs reports it in (usually USD). Null when nobody's
  // currently selling a copy.
  price: { value: number; currency: string } | null;
};

export type DiscogsCollection = {
  profileUrl: string;
  totalRecords: number;
  // Median collection value as Discogs formats it (e.g. "$1,234.56"), or null
  // when the value endpoint isn't available.
  medianValue: string | null;
  topPriced: DiscogsRecord[];
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

type MarketplaceStats = {
  lowest_price: { value: number; currency: string } | null;
};

const API = "https://api.discogs.com";
const TOP_COUNT = 6;
// Discogs' collection endpoint has no price field and can't be sorted by
// one, so pricing means one marketplace-stats lookup per release. Capped to
// the this-many most-recently-added releases so a big collection can't blow
// past Discogs' 60 requests/min rate limit in a single refresh.
const MAX_CONSIDERED = 50;
const PRICE_CONCURRENCY = 10;

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

// Runs `fn` over `items` with at most `limit` in flight at once.
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker)
  );
  return results;
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

  const [releasesPage, value] = await Promise.all([
    discogsGet<{
      pagination: { items: number };
      releases: RawRelease[];
    }>(
      `/users/${user}/collection/folders/0/releases?sort=added&sort_order=desc&per_page=${MAX_CONSIDERED}`,
      token
    ),
    discogsGet<{ median: string }>(`/users/${user}/collection/value`, token),
  ]);

  if (!releasesPage) return null;

  const withPrices = await mapWithConcurrency(
    releasesPage.releases,
    PRICE_CONCURRENCY,
    async (release): Promise<DiscogsRecord | null> => {
      const info = release.basic_information;
      const coverUrl = info.cover_image || info.thumb;
      if (!coverUrl) return null;

      const stats = await discogsGet<MarketplaceStats>(`/marketplace/stats/${info.id}`, token);

      return {
        id: info.id,
        title: info.title,
        artist: info.artists?.map((artist) => cleanArtist(artist.name)).join(", ") ?? "",
        year: info.year || null,
        coverUrl,
        url: `https://www.discogs.com/release/${info.id}`,
        price: stats?.lowest_price ?? null,
      };
    }
  );

  const topPriced = withPrices
    .filter((record): record is DiscogsRecord => record !== null && record.price !== null)
    .sort((a, b) => b.price!.value - a.price!.value)
    .slice(0, TOP_COUNT);

  return {
    profileUrl: `https://www.discogs.com/user/${user}/collection`,
    totalRecords: releasesPage.pagination.items,
    medianValue: value?.median ?? null,
    topPriced,
  };
}
