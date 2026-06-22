import { getSiteData } from "@/lib/site-data";
import { Navigation } from "@/components/Navigation";
import { Masthead } from "@/components/Masthead";
import { ProjectGrid } from "@/components/ProjectGrid";

export default async function HomePage() {
  const data = await getSiteData();
  const featuredProjects = data.projects.filter((p) => p.featured);

  return (
    <>
      <Navigation settings={data.settings} />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-28 md:px-10 md:pt-32">
        <Masthead settings={data.settings} />
        <ProjectGrid projects={featuredProjects} settings={data.settings} />
      </main>
      <footer className="border-t border-black/5 py-8 text-center">
        <p className="text-xs text-ink-faint">
          &copy; {new Date().getFullYear()} {data.settings.name}
        </p>
      </footer>
    </>
  );
}
