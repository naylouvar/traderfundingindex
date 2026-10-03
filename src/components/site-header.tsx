import Link from "next/link";
import { Brand } from "@/components/brand";
import { NavLinks } from "@/components/nav-links";
import { getContent } from "@/lib/content";

function SearchIcon() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <circle cx="9" cy="9" r="6" />
      <path d="m14 14 4 4" strokeLinecap="round" />
    </svg>
  );
}

export async function SiteHeader() {
  const site = await getContent();
  return (
    <header className="sticky top-0 z-40">
      {site.promoBar.text && (
        <div className="bg-accent px-4 py-2 text-center text-xs font-medium text-black">
          {site.promoBar.text}
          {site.promoBar.linkLabel && site.promoBar.href && (
            <Link href={site.promoBar.href} className="ml-2 rounded bg-black/85 px-2 py-0.5 text-white hover:bg-black">
              {site.promoBar.linkLabel}
            </Link>
          )}
        </div>
      )}
      <div className="border-b border-white/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
          <Brand brand={site.brand} />
          <nav aria-label="Main" className="hidden items-center gap-1 text-sm lg:flex">
            <NavLinks nav={site.nav} />
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <form action="/firms" role="search" className="relative hidden md:block">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                <SearchIcon />
              </span>
              <input name="q" type="search" placeholder="Search firms" aria-label="Search firms" className="input w-52 py-1.5 pl-9" />
            </form>
            <span className="hidden whitespace-nowrap text-sm text-muted/60 sm:inline" title="Member accounts are coming soon">
              Log in
            </span>
            <span className="btn-primary hidden cursor-default whitespace-nowrap py-1.5 opacity-70 sm:inline" title="Member accounts are coming soon">
              Sign up
            </span>
            <details className="group relative lg:hidden">
              <summary
                aria-label="Menu"
                className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-md border border-white/10 hover:bg-white/5 [&::-webkit-details-marker]:hidden"
              >
                <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 group-open:hidden" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
                </svg>
                <svg aria-hidden viewBox="0 0 20 20" className="hidden h-4 w-4 group-open:block" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
                </svg>
              </summary>
              <div className="absolute right-0 top-12 w-72 space-y-3 rounded-xl border border-white/10 bg-background p-3 shadow-2xl shadow-black/50">
                <form action="/firms" role="search" className="relative md:hidden">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                    <SearchIcon />
                  </span>
                  <input name="q" type="search" placeholder="Search firms" aria-label="Search firms" className="input pl-9" />
                </form>
                <nav aria-label="Mobile" className="text-sm">
                  <NavLinks nav={site.nav} mobile />
                </nav>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
