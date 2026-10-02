import Link from "next/link";
import { site } from "@/content/site";

export function SiteHeader() {
  return (
    <header>
      <div className="bg-accent px-4 py-2 text-center text-xs font-medium text-black">
        {site.promoBar.text}{" "}
        <Link href={site.promoBar.href} className="ml-1 rounded bg-black/85 px-2 py-0.5 text-white hover:bg-black">
          {site.promoBar.linkLabel}
        </Link>
      </div>
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3">
          <Link href="/" className="text-base font-bold tracking-tight">
            Trader<span className="text-accent">Funding</span>Index
          </Link>
          <form action="/firms" className="order-3 w-full sm:order-none sm:w-64">
            <input
              name="q"
              type="search"
              placeholder="Search firms"
              aria-label="Search firms"
              className="input py-1.5"
            />
          </form>
          <div className="flex rounded-lg border border-white/10 p-0.5 text-xs">
            {site.assetTabs.map((tab) =>
              tab.active ? (
                <span key={tab.label} className="rounded-md bg-accent px-3 py-1 font-semibold text-black">
                  {tab.label}
                </span>
              ) : (
                <span key={tab.label} title="Coming later" className="px-3 py-1 text-muted/60">
                  {tab.label}
                </span>
              ),
            )}
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm">
            <span className="text-muted/60" title="Coming soon">
              Log in
            </span>
            <span className="rounded-md bg-accent/90 px-3 py-1.5 text-xs font-semibold text-black opacity-60" title="Coming soon">
              Sign up
            </span>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 pb-3 text-sm">
          {site.nav.map((item) =>
            item.href ? (
              <Link key={item.label} href={item.href} className="whitespace-nowrap text-muted hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span key={item.label} className="whitespace-nowrap text-muted/50">
                {item.label}
                {item.note && <span className="ml-1 rounded bg-white/10 px-1 text-[10px]">{item.note}</span>}
              </span>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
