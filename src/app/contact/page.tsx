import { getSiteData } from "@/lib/site-data";
import { Navigation } from "@/components/Navigation";
import { ContactForm } from "@/components/ContactForm";

export default async function ContactPage() {
  const data = await getSiteData();
  const { settings } = data;

  const socialLinks = [
    { label: "Instagram", url: settings.social.instagram },
    { label: "Behance", url: settings.social.behance },
    { label: "LinkedIn", url: settings.social.linkedin },
    { label: "Twitter", url: settings.social.twitter },
    { label: "Dribbble", url: settings.social.dribbble },
  ].filter((link) => link.url);

  return (
    <>
      <Navigation settings={settings} />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-28 md:px-10 md:pt-32">
        <h1 className="font-display text-4xl text-ink md:text-5xl">Contact</h1>
        <p className="mt-6 text-base leading-relaxed text-ink-muted md:text-lg">
          Interested in working together? Send a message or reach out directly.
        </p>

        <div className="mt-12">
          <ContactForm email={settings.email} />
        </div>

        {socialLinks.length > 0 && (
          <div className="mt-16 border-t border-black/5 pt-10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-ink-faint">
              Connect
            </p>
            <ul className="mt-4 flex flex-wrap gap-6">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink transition-opacity hover:opacity-60"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10">
          <a
            href={`mailto:${settings.email}`}
            className="text-sm text-ink-muted transition-opacity hover:opacity-60"
          >
            {settings.email}
          </a>
        </div>
      </main>
    </>
  );
}
