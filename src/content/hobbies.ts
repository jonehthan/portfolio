// Placeholder shape for the Hobbies section. The Pokemon-cards entry will
// eventually fetch real card art from the pokemontcg.io API using these
// card names — that integration comes in a later session.
export type PokemonCollection = {
  title: string;
  blurb: string;
  cardNames: string[];
};

export const pokemonCollection: PokemonCollection = {
  title: "Pokemon Card Collection",
  blurb:
    "I collect Pokemon cards — this section will showcase favorites from my collection, pulled in from the Pokemon TCG API.",
  cardNames: [],
};
