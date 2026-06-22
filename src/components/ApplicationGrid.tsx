import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { Application } from "@/lib/types";

interface ApplicationGridProps {
  applications: Application[];
  gutter?: number;
}

export function ApplicationGrid({
  applications,
  gutter = 24,
}: ApplicationGridProps) {
  return (
    <div
      className="grid grid-cols-1 gap-8 md:grid-cols-2"
      style={{ gap: `${gutter}px` }}
    >
      {applications.map((app) => (
        <article
          key={app.id}
          id={app.slug}
          className="overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm"
        >
          <a
            href={app.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-canvas-soft">
              <Image
                src={app.screenshot}
                alt={app.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors group-hover:bg-ink/10">
                <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs uppercase tracking-[0.15em] text-ink opacity-0 transition-opacity group-hover:opacity-100">
                  <ExternalLink size={14} />
                  Live Demo
                </span>
              </div>
            </div>
          </a>
          <div className="p-6">
            <h3 className="font-display text-xl text-ink">{app.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {app.description}
            </p>
            <a
              href={app.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink transition-opacity hover:opacity-60"
            >
              <ExternalLink size={14} />
              Open Live Demo
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
