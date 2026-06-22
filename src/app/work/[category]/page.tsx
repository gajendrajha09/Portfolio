import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteData } from "@/lib/site-data";
import { Navigation } from "@/components/Navigation";
import { CategoryNav } from "@/components/CategoryNav";
import { CollectionBrowser } from "@/components/CollectionBrowser";
import { ApplicationGrid } from "@/components/ApplicationGrid";
import {
  getCategoryMeta,
  isCollectionCategory,
} from "@/lib/categories";
import { filterCollections } from "@/lib/work-helpers";

interface WorkCategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return [
    { category: "generative-ai" },
    { category: "3d" },
    { category: "applications" },
  ];
}

export default async function WorkCategoryPage({
  params,
}: WorkCategoryPageProps) {
  const { category } = await params;
  const meta = getCategoryMeta(category);

  if (!meta) notFound();

  const data = await getSiteData();

  return (
    <>
      <Navigation settings={data.settings} />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-28 md:px-10 md:pt-32">
        <Link
          href="/"
          className="mb-8 inline-block text-xs uppercase tracking-[0.2em] text-ink-muted transition-opacity hover:opacity-60"
        >
          ← All Work
        </Link>

        <header className="mb-10 md:mb-14">
          <p className="text-[10px] uppercase tracking-[0.25em] text-ink-faint">
            Work
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">
            {meta.label}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-muted md:text-lg">
            {meta.description}
          </p>
        </header>

        <CategoryNav active={category} className="mb-12" />

        {category === "applications" ? (
          <ApplicationGrid
            applications={data.applications}
            gutter={data.settings.gridGutter}
          />
        ) : isCollectionCategory(category) ? (
          <CollectionBrowser
            collections={filterCollections(data.collections, category)}
            category={category}
            gutter={data.settings.gridGutter}
          />
        ) : null}
      </main>
    </>
  );
}
