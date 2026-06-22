import { getSiteData } from "@/lib/site-data";
import { getFeaturedVisualIndex } from "@/lib/work-helpers";
import { Navigation } from "@/components/Navigation";
import { Masthead } from "@/components/Masthead";
import { CategoryNav } from "@/components/CategoryNav";
import { VisualIndex } from "@/components/VisualIndex";

export default async function HomePage() {
  const data = await getSiteData();
  const indexItems = getFeaturedVisualIndex(data);

  return (
    <>
      <Navigation settings={data.settings} />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 md:px-6 md:pt-32">
        <Masthead settings={data.settings} />
        <CategoryNav className="mb-10" />
        <VisualIndex items={indexItems} gutter={data.settings.gridGutter} />
      </main>
      <footer className="border-t border-black/5 py-8 text-center">
        <p className="text-xs text-ink-faint">
          &copy; {new Date().getFullYear()} {data.settings.name}
        </p>
      </footer>
    </>
  );
}
