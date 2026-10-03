import Link from "next/link";
import { ChallengesTable } from "@/components/challenges-table";
import { Faq } from "@/components/faq";
import { FirmTable } from "@/components/firm-table";
import { Newsletter } from "@/components/newsletter";
import { OfferCard } from "@/components/offer-card";
import { ReviewList } from "@/components/review-list";
import { getContent } from "@/lib/content";
import { getApprovedReviews, getChallenges, getRankedFirms, getSiteStats, hasActiveOffer } from "@/lib/firms";

export const dynamic = "force-dynamic";

const TABS = ["firms", "challenges", "offers", "reviews"] as const;
type Tab = (typeof TABS)[number];

export default async function Home({ searchParams }: PageProps<"/">) {
  const { tab: tabParam } = await searchParams;
  const tab: Tab = TABS.includes(tabParam as Tab) ? (tabParam as Tab) : "firms";
  const [site, firms, stats] = await Promise.all([getContent(), getRankedFirms(), getSiteStats()]);
  const featuredOffers = firms.filter((f) => f.featured && hasActiveOffer(f));
  const allOffers = firms.filter((f) => hasActiveOffer(f));
  const statBadges = [
    { value: stats.firms, label: site.stats.firms },
    { value: stats.reviews, label: site.stats.reviews },
    { value: stats.payouts, label: site.stats.payouts },
    { value: stats.rules, label: site.stats.rules },
  ].filter((s) => s.label);

  return (
    <div className="space-y-16">
      <section className="space-y-6 pt-6 text-center">
        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs">
          {site.assetTabs.map((tab) => (
            <span
              key={tab.label}
              title={tab.active ? undefined : "Coming later"}
              className={tab.active ? "rounded-full bg-accent px-3 py-1 font-semibold text-black" : "px-3 py-1 text-muted/60"}
            >
              {tab.label}
              {!tab.active && <span className="ml-1 text-[10px] uppercase">soon</span>}
            </span>
          ))}
        </div>
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
        <div>
          <h2 className="text-lg font-semibold">{site.offers.title}</h2>
          <p className="text-sm text-muted">{site.offers.subtitle}</p>
        </div>
        {featuredOffers.length === 0 ? (
          <p className="text-sm text-muted">{site.offers.empty}</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featuredOffers.map((firm) => (
              <OfferCard key={firm.id} firm={firm} />
            ))}
          </div>
        )}
      </section>

      <section id="rankings" className="scroll-mt-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex gap-1 rounded-lg border border-white/10 p-1 text-sm">
            {TABS.map((t, i) => (
              <Link
                key={t}
                href={t === "firms" ? "/#rankings" : `/?tab=${t}#rankings`}
                scroll={false}
                className={
                  t === tab
                    ? "rounded-md bg-accent px-3 py-1 font-semibold text-black"
                    : "rounded-md px-3 py-1 text-muted hover:text-foreground"
                }
              >
                {site.table.tabs[i] ?? t}
              </Link>
            ))}
          </nav>
          <Link href={site.table.methodHref} className="text-sm text-muted underline hover:text-foreground">
            {site.table.method}
          </Link>
        </div>
        <h2 className="sr-only">{site.table.title}</h2>

        {tab === "firms" && (
          <>
            <FirmTable firms={firms.slice(0, 20)} />
            {firms.length > 20 && (
              <div className="text-center">
                <Link href="/firms" className="btn-secondary">
                  View all firms
                </Link>
              </div>
            )}
          </>
        )}
        {tab === "challenges" && <ChallengesTable challenges={await getChallenges()} />}
        {tab === "offers" &&
          (allOffers.length === 0 ? (
            <p className="rounded-xl border border-white/10 p-8 text-center text-muted">{site.offers.empty}</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allOffers.map((firm) => (
                <OfferCard key={firm.id} firm={firm} />
              ))}
            </div>
          ))}
        {tab === "reviews" && <ReviewList reviews={await getApprovedReviews()} />}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {site.pillars
          .filter((p) => p.title)
          .map((p) => (
            <div key={p.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.body}</p>
            </div>
          ))}
      </section>

      <Faq />
      <Newsletter copy={site.newsletter} />
    </div>
  );
}
