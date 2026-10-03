import Link from "next/link";
import { Faq } from "@/components/faq";
import { FirmTable } from "@/components/firm-table";
import { Newsletter } from "@/components/newsletter";
import { OfferCard } from "@/components/offer-card";
import { site } from "@/content/site";
import { getRankedFirms, getSiteStats, hasActiveOffer } from "@/lib/firms";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [firms, stats] = await Promise.all([getRankedFirms(), getSiteStats()]);
  const offers = firms.filter((f) => f.featured && hasActiveOffer(f));
  const statBadges = [
    { value: stats.firms, label: "futures firms tracked" },
    { value: stats.reviews, label: "verified reviews" },
    { value: stats.payouts, label: "payout reports" },
    { value: stats.rules, label: "hidden rules exposed" },
  ];

  return (
    <div className="space-y-16">
      <section className="space-y-6 pt-4 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{site.hero.title}</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">{site.hero.subtitle}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {statBadges.map((s) => (
            <span key={s.label} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm">
              <strong className="text-accent">{s.value}</strong> <span className="text-muted">{s.label}</span>
            </span>
          ))}
        </div>
      </section>

      <section id="offers" className="scroll-mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">{site.offers.title}</h2>
            <p className="text-sm text-muted">{site.offers.subtitle}</p>
          </div>
        </div>
        {offers.length === 0 ? (
          <p className="text-sm text-muted">{site.offers.empty}</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {offers.map((firm) => (
              <OfferCard key={firm.id} firm={firm} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-lg border border-white/10 p-1 text-sm">
            {site.table.tabs.map((tab, i) => (
              <span
                key={tab}
                className={i === 0 ? "rounded-md bg-accent px-3 py-1 font-semibold text-black" : "px-3 py-1 text-muted/60"}
                title={i === 0 ? undefined : "Coming soon"}
              >
                {tab}
              </span>
            ))}
          </div>
          <Link href={site.table.methodHref} className="text-sm text-muted underline hover:text-foreground">
            {site.table.method}
          </Link>
        </div>
        <h2 className="sr-only">{site.table.title}</h2>
        <FirmTable firms={firms.slice(0, 20)} />
        {firms.length > 20 && (
          <div className="text-center">
            <Link href="/firms" className="btn-secondary">
              View all firms
            </Link>
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {site.pillars.map((p) => (
          <div key={p.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-muted">{p.body}</p>
          </div>
        ))}
      </section>

      <Faq />
      <Newsletter />
    </div>
  );
}
