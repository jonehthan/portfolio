import type { CSSProperties } from "react";
import { Hero } from "@/components/Hero";
import { SectionHeading } from "@/components/SectionHeading";
import { activities, experience } from "@/content/profile";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";
import { Skills } from "@/components/Skills";
import { ProjectsList } from "@/components/ProjectsList";
import { DashboardSection } from "@/components/DashboardSection";
import { PokemonShowcase } from "@/components/PokemonShowcase";
import { DiscogsShowcase } from "@/components/DiscogsShowcase";
import { MessageBoard } from "@/components/MessageBoard";
import { SongBoard } from "@/components/SongBoard";
import { getPublishedMessages, getPublishedSongs } from "@/lib/board";
import { projects } from "@/content/projects";
import { pokemonCollection } from "@/content/hobbies";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [messageEntries, songEntries] = await Promise.all([
    getPublishedMessages(),
    getPublishedSongs(),
  ]);

  return (
    <div className="mx-auto grid max-w-6xl gap-x-12 px-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0">
        <Hero />

        <hr
          aria-hidden="true"
          className="border-0"
          style={{ borderTop: "var(--rule-hair) solid var(--color-rule)" }}
        />

        <section id="experience" className="reveal py-16" style={{ "--i": 1 } as CSSProperties}>
          <SectionHeading title="Experience" />
          <Experience jobs={experience} />
        </section>

        <section id="projects" className="reveal py-12" style={{ "--i": 2 } as CSSProperties}>
          <SectionHeading title="Projects" description="Things I've built, from ML to full-stack." />
          <ProjectsList projects={projects} />
        </section>

        <section id="education" className="reveal py-12" style={{ "--i": 3 } as CSSProperties}>
          <SectionHeading title="Education" />
          <Education />
        </section>

        <section id="activities" className="reveal py-12" style={{ "--i": 4 } as CSSProperties}>
          <SectionHeading title="Activities" />
          <Experience jobs={activities} />
        </section>

        <section id="skills" className="reveal py-12" style={{ "--i": 5 } as CSSProperties}>
          <SectionHeading title="Skills & interests" />
          <Skills />
        </section>

        <section
          id="hobbies"
          className="reveal py-12"
          style={{ "--i": 6 } as CSSProperties}
        >
          <SectionHeading title={pokemonCollection.title} description={pokemonCollection.blurb} />
          <PokemonShowcase />
        </section>

        <section id="records" className="reveal py-12" style={{ "--i": 7 } as CSSProperties}>
          <SectionHeading
            title="Record Collection"
            description="What's been landing on my shelf lately, pulled in from Discogs."
          />
          <DiscogsShowcase />
        </section>

        <section
          id="dashboard"
          className="reveal py-20 sm:py-24"
          style={{ "--i": 8 } as CSSProperties}
        >
          <SectionHeading
            title="Living Dashboard"
            description="What I'm building and listening to, updated automatically."
          />
          <DashboardSection />
        </section>
      </div>

      {/* Right-hand column on wide screens; stacks below the profile on small ones. */}
      <aside
        className="reveal flex flex-col gap-14 pb-20 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto lg:py-16 lg:pb-6"
        style={{ "--i": 9 } as CSSProperties}
      >
        <section id="messages" className="scroll-mt-6">
          <SectionHeading title="Message board" description="Leave a note. A hello is plenty." />
          <MessageBoard initialEntries={messageEntries} />
        </section>

        <section id="songs" className="scroll-mt-6">
          <SectionHeading
            title="Songs & playlists"
            description="Share a favorite song, playlist, or album."
          />
          <SongBoard initialEntries={songEntries} />
        </section>
      </aside>
    </div>
  );
}
