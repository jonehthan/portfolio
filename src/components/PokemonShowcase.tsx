import { fetchPokemonCards } from "@/lib/pokemon-tcg";
import { pokemonCollection } from "@/content/hobbies";
import { PlaceholderSection } from "@/components/PlaceholderSection";

export async function PokemonShowcase() {
  const cards = await fetchPokemonCards(pokemonCollection.cards);

  if (cards.length === 0) {
    return (
      <PlaceholderSection note="No cards yet — add some to src/content/hobbies.ts." />
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <li key={card.imageUrl} className="flex flex-col gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full rounded-lg"
          />
          <div className="text-sm">
            <p className="font-medium">{card.name}</p>
            <p className="text-black/60 dark:text-white/60">
              {card.setName}
              {card.rarity ? ` · ${card.rarity}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
