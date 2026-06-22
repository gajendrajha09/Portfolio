import type { Application, Collection, SiteData } from "./types";

export interface VisualIndexItem {
  id: string;
  title: string;
  coverImage: string;
  href: string;
  category: string;
  subcategory?: string;
  external?: boolean;
}

export function getFeaturedVisualIndex(data: SiteData): VisualIndexItem[] {
  const collections: VisualIndexItem[] = data.collections
    .filter((c) => c.featured)
    .map((c) => ({
      id: c.id,
      title: c.title,
      coverImage: c.coverImage,
      href: `/work/${c.category}/${c.slug}`,
      category: c.category,
      subcategory: c.subcategory,
    }));

  const apps: VisualIndexItem[] = data.applications
    .filter((a) => a.featured)
    .map((a) => ({
      id: a.id,
      title: a.title,
      coverImage: a.screenshot,
      href: `/work/applications#${a.slug}`,
      category: "applications",
    }));

  return [...collections, ...apps];
}

export function filterCollections(
  collections: Collection[],
  category: Collection["category"],
  subcategory?: string | null,
): Collection[] {
  return collections.filter(
    (c) =>
      c.category === category &&
      (!subcategory || subcategory === "all" || c.subcategory === subcategory),
  );
}

export function groupCollectionsBySubcategory(
  collections: Collection[],
): Record<string, Collection[]> {
  return collections.reduce<Record<string, Collection[]>>((acc, item) => {
    if (!acc[item.subcategory]) acc[item.subcategory] = [];
    acc[item.subcategory].push(item);
    return acc;
  }, {});
}

export function getApplicationBySlug(
  applications: Application[],
  slug: string,
): Application | undefined {
  return applications.find((a) => a.slug === slug);
}
