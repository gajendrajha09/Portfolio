import Link from "next/link";
import Image from "next/image";
import { WORK_CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  active?: string;
  className?: string;
}

export function CategoryNav({ active, className }: CategoryNavProps) {
  return (
    <nav className={cn("flex flex-wrap gap-3 md:gap-4", className)}>
      {WORK_CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={cat.href}
          className={cn(
            "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors md:text-sm",
            active === cat.slug
              ? "border-ink bg-ink text-white"
              : "border-black/10 bg-white text-ink-muted hover:border-ink/30 hover:text-ink",
          )}
        >
          {cat.label}
        </Link>
      ))}
    </nav>
  );
}
