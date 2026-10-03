import Link from "next/link";
import type { RankedFirm } from "@/lib/firms";
import { hasActiveOffer } from "@/lib/firms";
import { compactUsd, drawdownLabel, usd } from "@/lib/format";
import { FirmLogo } from "./firm-logo";
import { Stars } from "./stars";

export function FirmTable({ firms }: { firms: RankedFirm[] }) {
  if (firms.length === 0) {
    return <p className="rounded-xl border border-white/10 p-8 text-center text-muted">No firms match.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-muted">
          <tr className="border-b border-white/10">
            <th className="w-10 px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Firm</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Country</th>
            <th className="px-4 py-3 font-medium">Years</th>
            <th className="px-4 py-3 font-medium">Drawdown</th>
            <th className="px-4 py-3 font-medium">Platforms</th>
            <th className="px-4 py-3 font-medium">Split</th>
            <th className="px-4 py-3 font-medium">Max allocation</th>
            <th className="px-4 py-3 font-medium">Offer</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {firms.map((firm, i) => (
            <tr key={firm.id} className="border-t border-white/5 transition hover:bg-white/[0.03]">
              <td className="px-4 py-4 text-muted">{i + 1}</td>
              <td className="px-4 py-4">
                <Link href={`/firms/${firm.slug}`} className="flex items-center gap-3 font-semibold hover:text-accent">
                  <FirmLogo name={firm.name} logoUrl={firm.logoUrl} />
                  <span>
                    {firm.name}
                    {firm.status === "UNDER_WATCH" && (
                      <span className="ml-2 rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-medium text-red-300">
                        Under watch
                      </span>
                    )}
                  </span>
                </Link>
              </td>
              <td className="px-4 py-4">
                <Stars rating={firm.rating} count={firm.reviewCount} source={firm.ratingSource} />
              </td>
              <td className="px-4 py-4 text-muted">{firm.hqCountry ?? "—"}</td>
              <td className="px-4 py-4 text-muted">{firm.yearsInOperation ?? "—"}</td>
              <td className="px-4 py-4 text-muted">{firm.drawdownType ? drawdownLabel[firm.drawdownType] : "—"}</td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-1">
                  {firm.platformList.length === 0 && <span className="text-muted">—</span>}
                  {firm.platformList.slice(0, 3).map((p) => (
                    <span key={p} className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-muted">
                      {p}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-4">{firm.maxSplitPct ? `${firm.maxSplitPct}%` : "—"}</td>
              <td className="px-4 py-4 font-semibold">{compactUsd(firm.maxAllocationUsd)}</td>
              <td className="px-4 py-4">
                {hasActiveOffer(firm) ? (
                  <span className="inline-flex flex-col items-start gap-0.5">
                    {firm.promoDiscountPct && (
                      <span className="rounded bg-accent px-1.5 py-0.5 text-[11px] font-bold text-black">
                        {firm.promoDiscountPct}% OFF
                      </span>
                    )}
                    <code className="text-[11px] text-muted">{firm.promoCode}</code>
                  </span>
                ) : firm.minPriceUsd !== null ? (
                  <span className="text-xs text-muted">From {usd(firm.minPriceUsd)}</span>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
              <td className="px-4 py-4 text-right">
                <Link href={`/firms/${firm.slug}`} className="btn-secondary whitespace-nowrap text-xs">
                  View firm
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
