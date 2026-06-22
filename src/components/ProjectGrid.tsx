import Link from "next/link";
import Image from "next/image";
import type { Project, SiteSettings } from "@/lib/types";

interface ProjectGridProps {
  projects: Project[];
  settings: SiteSettings;
}

export function ProjectGrid({ projects, settings }: ProjectGridProps) {
  const columns = settings.gridColumns;
  const gutter = settings.gridGutter;

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gutter}px`,
      }}
    >
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.slug}`}
          className="group relative block overflow-hidden bg-canvas-soft"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" />
          </div>
          <div className="px-1 py-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-ink-faint">
              {project.category}
            </p>
            <h2 className="mt-1 font-display text-xl text-ink transition-opacity group-hover:opacity-60 md:text-2xl">
              {project.title}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
}
