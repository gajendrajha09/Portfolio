"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Collection } from "@/lib/types";
import {
  SUBCATEGORIES,
  getSubcategoryLabel,
  type SubcategoryOption,
} from "@/lib/categories";
import { cn } from "@/lib/utils";

interface CollectionBrowserProps {
  collections: Collection[];
  category: Collection["category"];
  gutter?: number;
}

export function CollectionBrowser({
  collections,
  category,
  gutter = 16,
}: CollectionBrowserProps) {
  const [activeSub, setActiveSub] = useState<string>("all");
  const subcategories: SubcategoryOption[] = SUBCATEGORIES[category];

  const filtered = collections.filter(
    (c) => activeSub === "all" || c.subcategory === activeSub,
  );

  const grouped =
    activeSub === "all"
      ? subcategories
          .map((sub) => ({
            sub,
            items: collections.filter((c) => c.subcategory === sub.slug),
          }))
          .filter((g) => g.items.length > 0)
      : [{ sub: subcategories.find((s) => s.slug === activeSub)!, items: filtered }];

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSub("all")}
          className={cn(
            "rounded-full px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors",
            activeSub === "all"
              ? "bg-ink text-white"
              : "bg-canvas-soft text-ink-muted hover:text-ink",
          )}
        >
          All
        </button>
        {subcategories.map((sub) => (
          <button
            key={sub.slug}
            onClick={() => setActiveSub(sub.slug)}
            className={cn(
              "rounded-full px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors",
              activeSub === sub.slug
                ? "bg-ink text-white"
                : "bg-canvas-soft text-ink-muted hover:text-ink",
            )}
          >
            {sub.label}
          </button>
        ))}
      </div>

      <div className="space-y-16">
        {grouped.map(({ sub, items }) => (
          <section key={sub.slug}>
            {activeSub === "all" && (
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                    Collection
                  </p>
                  <h2 className="mt-1 font-display text-2xl text-ink md:text-3xl">
                    {sub.label}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveSub(sub.slug)}
                  className="text-xs uppercase tracking-[0.15em] text-ink-muted transition-opacity hover:opacity-60"
                >
                  View all
                </button>
              </div>
            )}

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              style={{ gap: `${gutter}px` }}
            >
              {items.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/work/${category}/${collection.slug}`}
                  className="group block overflow-hidden bg-canvas-soft"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={collection.coverImage}
                      alt={collection.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="px-1 py-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                      {getSubcategoryLabel(category, collection.subcategory)}
                    </p>
                    <h3 className="mt-1 font-display text-lg text-ink transition-opacity group-hover:opacity-60">
                      {collection.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
                      {collection.description}
                    </p>
                    <p className="mt-3 text-xs text-ink-faint">
                      {collection.images.length} image
                      {collection.images.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {filtered.length === 0 && (
          <p className="py-20 text-center text-ink-muted">
            No collections in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
