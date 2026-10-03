import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">This page does not exist</h1>
      <p className="mt-3 text-muted">It may have moved, or the link may be wrong.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn-primary">
          Go to the homepage
        </Link>
        <Link href="/firms" className="btn-secondary">
          Browse firms
        </Link>
      </div>
    </div>
  );
}
