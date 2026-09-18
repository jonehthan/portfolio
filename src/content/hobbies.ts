import type { PokemonCardQuery } from "@/lib/pokemon-tcg";

export type PokemonCollection = {
  title: string;
  blurb: string;
  cards: PokemonCardQuery[];
};

export const pokemonCollection: PokemonCollection = {
  title: "Pokemon Card Collection",
  blurb: "A few favorites from my collection, pulled in from the Pokemon TCG API.",
  cards: [
    {
      nameQueries: ["Mega Darkrai ex", "Darkrai ex"],
      numberHint: "116",
      setHint: "Pitch Black",
    },
    {
      nameQueries: ["Dragonair"],
      numberHint: "181",
      setHint: "151",
    },
    {
      nameQueries: ["Cynthia's Roserade", "Roserade"],
      setHint: "Destined Rivals",
      rarityHint: "Illustration Rare",
    },
  ],
};
