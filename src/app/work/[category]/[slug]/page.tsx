import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSiteData } from "@/lib/site-data";
import { Navigation } from "@/components/Navigation";
import { PhotoGrid } from "@/components/PhotoGrid";
import { getSubcategoryLabel, isCollectionCategory } from "@/lib/categories";
import { formatDate } from "@/lib/utils";

interface CollectionPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const data = await getSiteData();
  return data.collections.map((c) => ({
    category: c.category,
    slug: c.slug,
  }));
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { category, slug } = await params;

  if (!isCollectionCategory(category)) notFound();

  const data = await getSiteData();
  const collection = data.collections.find(
    (c) => c.category === category && c.slug === slug,
  );

  if (!collection) notFound();

  return (
    <>
      <Navigation settings={data.settings} />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-28 md:px-10 md:pt-32">
        <Link
          href={`/work/${category}`}
          className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ink-muted transition-opacity hover:opacity-60"
        >
          <ArrowLeft size={14} />
          Back to {category === "generative-ai" ? "Generative AI" : "3D"}
        </Link>

        <header className="mb-12 md:mb-16">
          <p className="text-[10px] uppercase tracking-[0.25em] text-ink-faint">
            {getSubcategoryLabel(category, collection.subcategory)} &middot;{" "}
            {formatDate(collection.createdAt)}
          </p>
          <h1 className="mt-3 font-display text-3xl text-ink md:text-5xl">
            {collection.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            {collection.description}
          </p>
        </header>

        <PhotoGrid
          images={collection.images}
          columns={Math.min(data.settings.gridColumns, 2)}
          gutter={data.settings.gridGutter}
        />
      </main>
    </>
  );
}
