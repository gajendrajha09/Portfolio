"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

interface NavigationProps {
  settings: SiteSettings;
}

const navLinks = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navigation({ settings }: NavigationProps) {
  const pathname = usePathname();
  const isEditor = pathname.startsWith("/editor");

  if (isEditor) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          className="font-display text-lg tracking-wide text-ink transition-opacity hover:opacity-60 md:text-xl"
        >
          {settings.name}
        </Link>

        <nav className="flex items-center gap-6 md:gap-10">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/" || pathname.startsWith("/work")
                : pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-60 md:text-sm",
                  isActive ? "text-ink" : "text-ink-muted",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
