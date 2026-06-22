import { getSiteData } from "@/lib/site-data";
import { Navigation } from "@/components/Navigation";

export default async function AboutPage() {
  const data = await getSiteData();
  const { settings } = data;

  return (
    <>
      <Navigation settings={settings} />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-28 md:px-10 md:pt-32">
        <h1 className="font-display text-4xl text-ink md:text-5xl">About</h1>
        <div className="mt-10 space-y-6 text-base leading-relaxed text-ink-muted md:text-lg">
          {settings.about.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-16 border-t border-black/5 pt-10">
          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                Location
              </dt>
              <dd className="mt-2 text-ink">{settings.location}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                Email
              </dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${settings.email}`}
                  className="text-ink transition-opacity hover:opacity-60"
                >
                  {settings.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </main>
    </>
  );
}
