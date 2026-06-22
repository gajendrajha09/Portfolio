import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-6xl text-ink">404</h1>
      <p className="mt-4 text-ink-muted">This page could not be found.</p>
      <Link
        href="/"
        className="mt-8 text-sm uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-60"
      >
        Back to Work
      </Link>
    </div>
  );
}
