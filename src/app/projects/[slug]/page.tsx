import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSiteData } from "@/lib/site-data";
import { Navigation } from "@/components/Navigation";
import { PhotoGrid } from "@/components/PhotoGrid";
import { formatDate } from "@/lib/utils";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const data = await getSiteData();
  return data.projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const data = await getSiteData();
  const project = data.projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <>
      <Navigation settings={data.settings} />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-28 md:px-10 md:pt-32">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ink-muted transition-opacity hover:opacity-60"
        >
          <ArrowLeft size={14} />
          Back to Work
        </Link>

        <header className="mb-12 md:mb-16">
          <p className="text-[10px] uppercase tracking-[0.25em] text-ink-faint">
            {project.category} &middot; {formatDate(project.createdAt)}
          </p>
          <h1 className="mt-3 font-display text-3xl text-ink md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            {project.description}
          </p>
        </header>

        <PhotoGrid
          images={project.images}
          columns={Math.min(data.settings.gridColumns, 2)}
          gutter={data.settings.gridGutter}
        />
      </main>
    </>
  );
}
