import type { CollectionCategory, WorkCategory } from "./types";

export interface SubcategoryOption {
  slug: string;
  label: string;
}

export interface CategoryMeta {
  slug: WorkCategory;
  label: string;
  description: string;
  href: string;
}

export const WORK_CATEGORIES: CategoryMeta[] = [
  {
    slug: "generative-ai",
    label: "Generative AI",
    description: "AI-generated imagery, influencers, workflows, and environments",
    href: "/work/generative-ai",
  },
  {
    slug: "3d",
    label: "3D",
    description: "Product renders, characters, environments, and motion",
    href: "/work/3d",
  },
  {
    slug: "applications",
    label: "Applications",
    description: "Web apps and tools with live demo links",
    href: "/work/applications",
  },
];

export const SUBCATEGORIES: Record<CollectionCategory, SubcategoryOption[]> = {
  "generative-ai": [
    { slug: "ai-influencer", label: "AI Influencer" },
    { slug: "workflows", label: "Workflows" },
    { slug: "environment", label: "Environment" },
    { slug: "portraits", label: "Portraits" },
    { slug: "concept-art", label: "Concept Art" },
  ],
  "3d": [
    { slug: "product", label: "Product" },
    { slug: "character", label: "Character" },
    { slug: "environment", label: "Environment" },
    { slug: "motion", label: "Motion" },
    { slug: "visualization", label: "Visualization" },
  ],
};

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return WORK_CATEGORIES.find((c) => c.slug === slug);
}

export function getSubcategoryLabel(
  category: CollectionCategory,
  slug: string,
): string {
  return (
    SUBCATEGORIES[category].find((s) => s.slug === slug)?.label ??
    slug.replace(/-/g, " ")
  );
}

export function isCollectionCategory(
  slug: string,
): slug is CollectionCategory {
  return slug === "generative-ai" || slug === "3d";
}
