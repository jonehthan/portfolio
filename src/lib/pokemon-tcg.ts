export type PokemonCardQuery = {
  // Name(s) to try searching pokemontcg.io by, in order, until one returns
  // results — some cards (trainer-owned Pokemon, "ex"/"Mega" variants) need
  // a different literal name than the plain species name.
  nameQueries: string[];
  // The exact card number (as printed, e.g. "116" for a "116/084" secret
  // rare) — when set, this alone picks the print, since it's unambiguous.
  numberHint?: string;
  // Optional hint (e.g. a word from the set name) to pick the right print
  // when a name matches cards across multiple sets and numberHint isn't set.
  setHint?: string;
  // Optional hint (e.g. "Illustration Rare") to pick the right print when a
  // name matches multiple cards within the same set and numberHint isn't set.
  rarityHint?: string;
};

export type PokemonCardResult = {
  name: string;
  setName: string;
  rarity: string | null;
  imageUrl: string;
};

type RawCard = {
  name: string;
  number?: string;
  rarity?: string;
  set?: { name?: string };
  images?: { small?: string; large?: string };
};

async function searchByName(nameQuery: string): Promise<RawCard[]> {
  // pageSize is high on purpose: a common name (e.g. "Dragonair") can have
  // 25+ printings, and the print we want isn't guaranteed to sort near the
  // top — pickBestMatch needs to see every candidate to score correctly.
  const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(
    `name:"${nameQuery}"`
  )}&pageSize=250`;

  const headers: Record<string, string> = {};
  if (process.env.POKEMONTCG_API_KEY) {
    headers["X-Api-Key"] = process.env.POKEMONTCG_API_KEY;
  }

  // The free, unauthenticated pokemontcg.io tier is known to be flaky
  // (transient 500/502/403s under normal use) — a couple of retries with a
  // short backoff smooths over that without needing an API key.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers,
        next: { revalidate: 86_400 },
      });

      if (response.ok) {
        const json = await response.json();
        return json.data ?? [];
      }
    } catch {
      // fall through to retry
    }

    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  return [];
}

function wordMatchScore(haystack: string, hint?: string): number {
  if (!hint) return 0;
  const words = hint.toLowerCase().split(/\s+/).filter(Boolean);
  const lowerHaystack = haystack.toLowerCase();
  return words.reduce((acc, word) => acc + (lowerHaystack.includes(word) ? 1 : 0), 0);
}

function pickBestMatch(
  cards: RawCard[],
  numberHint?: string,
  setHint?: string,
  rarityHint?: string
): RawCard | null {
  if (cards.length === 0) return null;

  if (numberHint) {
    const exact = cards.find((card) => card.number === numberHint);
    if (exact) return exact;
  }

  if (!setHint && !rarityHint) return cards[0];

  let best = cards[0];
  let bestScore = -1;

  for (const card of cards) {
    const score =
      wordMatchScore(card.set?.name ?? "", setHint) +
      wordMatchScore(card.rarity ?? "", rarityHint);
    if (score > bestScore) {
      bestScore = score;
      best = card;
    }
  }

  return best;
}

export async function fetchPokemonCards(
  queries: PokemonCardQuery[]
): Promise<PokemonCardResult[]> {
  const results = await Promise.all(
    queries.map(async (query) => {
      for (const nameQuery of query.nameQueries) {
        const cards = await searchByName(nameQuery);
        const best = pickBestMatch(cards, query.numberHint, query.setHint, query.rarityHint);
        const imageUrl = best?.images?.large ?? best?.images?.small;
        if (best && imageUrl) {
          return {
            name: best.name,
            setName: best.set?.name ?? "Unknown set",
            rarity: best.rarity ?? null,
            imageUrl,
          };
        }
      }
      return null;
    })
  );

  return results.filter((result): result is PokemonCardResult => result !== null);
}
