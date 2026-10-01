import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { drawdownLabel, usd } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Compare futures prop firms" };

export default async function FirmsPage() {
  const firms = await db.firm.findMany({
    where: { assetClass: "FUTURES" },
    orderBy: { name: "asc" },
    include: { plans: { orderBy: { accountSizeUsd: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Futures prop firms</h1>
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Firm</th>
              <th className="px-4 py-3 font-medium">Plans</th>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">Profit split</th>
              <th className="px-4 py-3 font-medium">Drawdown</th>
              <th className="px-4 py-3 font-medium">Platforms</th>
            </tr>
          </thead>
          <tbody>
            {firms.map((firm) => {
              const cheapest = firm.plans.find((p) => p.priceUsd !== null);
              const split = firm.plans.find((p) => p.profitSplitPct !== null);
              const drawdown = firm.plans.find((p) => p.drawdownType !== null);
              return (
                <tr key={firm.id} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <Link
                      href={`/firms/${firm.slug}`}
                      className="font-medium hover:text-accent"
                    >
                      {firm.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{firm.plans.length || "—"}</td>
                  <td className="px-4 py-3">{usd(cheapest?.priceUsd)}</td>
                  <td className="px-4 py-3">
                    {split ? `${split.profitSplitPct}%` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {drawdown?.drawdownType
                      ? drawdownLabel[drawdown.drawdownType]
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {firm.platforms ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {firms.length === 0 && (
        <p className="text-muted">No firms yet. Run the seed script.</p>
      )}
    </div>
  );
}
