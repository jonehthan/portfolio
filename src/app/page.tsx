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

      <section id="projects" className="mx-auto max-w-4xl px-6 py-12">
        <SectionHeading
          title="Projects"
          description="A few things I've built. Each links out to the code."
        />
        <ProjectsGrid projects={projects} />
      </section>

      <section id="hobbies" className="mx-auto max-w-4xl px-6 py-12">
        <SectionHeading title={pokemonCollection.title} description={pokemonCollection.blurb} />
        <PokemonShowcase />
      </section>

      <section id="dashboard" className="mx-auto max-w-4xl px-6 py-12">
        <SectionHeading
          title="Living Dashboard"
          description="What I'm building and listening to, updated automatically."
        />
        <DashboardSection />
      </section>
    </>
  );
}
