import type { SiteSettings } from "@/lib/types";

interface MastheadProps {
  settings: SiteSettings;
}

export function Masthead({ settings }: MastheadProps) {
  if (!settings.showMasthead) return null;

  return (
    <section className="mb-16 text-center md:mb-24">
      <h1 className="font-display text-4xl tracking-tight text-ink md:text-6xl lg:text-7xl">
        {settings.name}
      </h1>
      <p className="mt-4 text-sm uppercase tracking-[0.3em] text-ink-muted md:text-base">
        {settings.tagline}
      </p>
    </section>
  );
}
