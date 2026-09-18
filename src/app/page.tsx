import { Hero } from "@/components/Hero";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { PlaceholderSection } from "@/components/PlaceholderSection";
import { DashboardSection } from "@/components/DashboardSection";
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
        <PlaceholderSection
          title="Hobbies"
          description={pokemonCollection.blurb}
          note="Pokemon card showcase coming soon — will pull real card art from the Pokemon TCG API."
        />
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
