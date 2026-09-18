import type { CSSProperties } from "react";
import { Hero } from "@/components/Hero";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { DashboardSection } from "@/components/DashboardSection";
import { PokemonShowcase } from "@/components/PokemonShowcase";
import { projects } from "@/content/projects";
import { pokemonCollection } from "@/content/hobbies";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />

      <hr
        aria-hidden="true"
        className="mx-auto max-w-4xl border-0"
        style={{ borderTop: "var(--rule-hair) solid var(--color-rule)" }}
      />

      <section
        id="projects"
        className="reveal mx-auto max-w-4xl px-6 py-16"
        style={{ "--i": 1 } as CSSProperties}
      >
        <SectionHeading
          title="Projects"
          description="A few things I've built. Each links out to the code."
        />
        <ProjectsGrid projects={projects} />
      </section>

      <section
        id="hobbies"
        className="reveal mx-auto max-w-4xl px-6 py-12"
        style={{ "--i": 2 } as CSSProperties}
      >
        <SectionHeading title={pokemonCollection.title} description={pokemonCollection.blurb} />
        <PokemonShowcase />
      </section>

      <section
        id="dashboard"
        className="reveal mx-auto max-w-4xl px-6 py-20 sm:py-24"
        style={{ "--i": 3 } as CSSProperties}
      >
        <SectionHeading
          title="Living Dashboard"
          description="What I'm building and listening to, updated automatically."
        />
        <DashboardSection />
      </section>
    </>
  );
}
