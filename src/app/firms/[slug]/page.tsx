import { notFound } from "next/navigation";
import { ReviewList } from "@/components/review-list";
import { db } from "@/lib/db";
import { drawdownLabel, usd } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/firms/[slug]">) {
  const { slug } = await params;
  const firm = await db.firm.findUnique({ where: { slug } });
  return { title: firm ? `${firm.name} review, rules and payouts` : "Firm" };
}

export default async function FirmPage({ params }: PageProps<"/firms/[slug]">) {
  const { slug } = await params;
  const firm = await db.firm.findUnique({
    where: { slug },
    include: {
      plans: { orderBy: { accountSizeUsd: "asc" } },
      rules: { orderBy: { severity: "desc" } },
      countryRules: { where: { status: { not: "ALLOWED" } } },
      reviews: {
        where: { moderation: "APPROVED" },
        orderBy: { createdAt: "desc" },
        include: { firm: { select: { name: true, slug: true, logoUrl: true } }, user: { select: { handle: true } } },
      },
    },
  });
  if (!firm) notFound();

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">{firm.name}</h1>
        <p className="text-sm text-muted">
          {firm.platforms ?? "Platforms not listed yet"}
          {firm.lastVerifiedAt &&
            ` · last checked ${firm.lastVerifiedAt.toISOString().slice(0, 10)}`}
        </p>
        {firm.website && (
          <a href={firm.website} rel="nofollow noopener" className="text-sm text-accent">
            {firm.website}
          </a>
        )}
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Plans</h2>
        {firm.plans.length === 0 ? (
          <p className="text-muted">Plan data is being collected.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Account</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Activation</th>
                  <th className="px-4 py-3 font-medium">Target</th>
                  <th className="px-4 py-3 font-medium">Max drawdown</th>
                  <th className="px-4 py-3 font-medium">Drawdown type</th>
                  <th className="px-4 py-3 font-medium">Max contracts</th>
                  <th className="px-4 py-3 font-medium">Split</th>
                </tr>
              </thead>
              <tbody>
                {firm.plans.map((p) => (
                  <tr key={p.id} className="border-t border-white/10">
                    <td className="px-4 py-3">{usd(p.accountSizeUsd)}</td>
                    <td className="px-4 py-3">{usd(p.priceUsd)}</td>
                    <td className="px-4 py-3">{usd(p.activationFeeUsd)}</td>
                    <td className="px-4 py-3">{usd(p.profitTargetUsd)}</td>
                    <td className="px-4 py-3">{usd(p.maxDrawdownUsd)}</td>
                    <td className="px-4 py-3">
                      {p.drawdownType ? drawdownLabel[p.drawdownType] : "—"}
                    </td>
                    <td className="px-4 py-3">{p.maxContracts ?? "—"}</td>
                    <td className="px-4 py-3">
                      {p.profitSplitPct ? `${p.profitSplitPct}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Rules to know</h2>
        {firm.rules.length === 0 ? (
          <p className="text-muted">No rules documented yet.</p>
        ) : (
          <ul className="space-y-2">
            {firm.rules.map((r) => (
              <li key={r.id} className="rounded-lg border border-white/10 p-4 text-sm">
                {r.hidden && (
                  <span className="mr-2 rounded bg-accent/20 px-1.5 py-0.5 text-xs text-accent">
                    Hidden
                  </span>
                )}
                {r.text}
                {r.sourceUrl && (
                  <a href={r.sourceUrl} rel="nofollow noopener" className="ml-2 text-muted underline">
                    source
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Country restrictions</h2>
        {firm.countryRules.length === 0 ? (
          <p className="text-muted">No restrictions documented yet.</p>
        ) : (
          <p className="text-sm">
            {firm.countryRules
              .map((c) => `${c.countryCode} (${c.status.toLowerCase()})`)
              .join(", ")}
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Trader reviews</h2>
        <ReviewList reviews={firm.reviews} />
      </section>
    </div>
  );
}
