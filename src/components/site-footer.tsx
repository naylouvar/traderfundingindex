import Link from "next/link";
import { getContent } from "@/lib/content";

export async function SiteFooter() {
  const site = await getContent();
  return (
    <footer className="mt-20 border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          <Link href="/" className="text-base font-bold tracking-tight">
            Trader<span className="text-accent">Funding</span>Index
          </Link>
          <p className="max-w-xs text-sm text-muted">{site.footer.tagline}</p>
        </div>
        {site.footer.columns.map((col) => (
          <div key={col.title} className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{col.title}</h3>
            <ul className="space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <Link href={link.href} className="text-foreground/80 hover:text-accent">
                      {link.label}
                    </Link>
                  ) : (
                    <span className="text-muted/60">{link.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. {site.footer.disclaimer}
      </div>
    </footer>
  );
}
