"use client";

import Link from "next/link";
import Image from "next/image";
import type { VisualIndexItem } from "@/lib/work-helpers";
import { getSubcategoryLabel } from "@/lib/categories";
import type { CollectionCategory } from "@/lib/types";

interface VisualIndexProps {
  items: VisualIndexItem[];
  gutter?: number;
}

export function VisualIndex({ items, gutter = 8 }: VisualIndexProps) {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4"
      style={{ gap: `${gutter}px` }}
    >
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="group relative block overflow-hidden bg-canvas-soft"
        >
          <div className="relative aspect-square w-full">
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/15" />
            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">
                {item.subcategory && item.category !== "applications"
                  ? getSubcategoryLabel(
                      item.category as CollectionCategory,
                      item.subcategory,
                    )
                  : item.category.replace("-", " ")}
              </p>
              <p className="mt-1 text-sm font-medium text-white">{item.title}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
