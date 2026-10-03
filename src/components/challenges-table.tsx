import Link from "next/link";
import type { getChallenges } from "@/lib/firms";
import { drawdownLabel, usd } from "@/lib/format";
import { FirmLogo } from "./firm-logo";

type Challenge = Awaited<ReturnType<typeof getChallenges>>[number];

export function ChallengesTable({ challenges }: { challenges: Challenge[] }) {
  if (challenges.length === 0) {
    return <p className="rounded-xl border border-white/10 p-8 text-center text-muted">No challenges listed yet.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-muted">
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 font-medium">Firm</th>
            <th className="px-4 py-3 font-medium">Challenge</th>
            <th className="px-4 py-3 font-medium">Account</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Activation</th>
            <th className="px-4 py-3 font-medium">Target</th>
            <th className="px-4 py-3 font-medium">Max drawdown</th>
            <th className="px-4 py-3 font-medium">Drawdown type</th>
            <th className="px-4 py-3 font-medium">Contracts</th>
            <th className="px-4 py-3 font-medium">Split</th>
          </tr>
        </thead>
        <tbody>
          {challenges.map((c) => (
            <tr key={c.id} className="border-t border-white/5 hover:bg-white/[0.03]">
              <td className="px-4 py-3">
                <Link href={`/firms/${c.firm.slug}`} className="flex items-center gap-2 font-semibold hover:text-accent">
                  <FirmLogo name={c.firm.name} logoUrl={c.firm.logoUrl} size={28} />
                  {c.firm.name}
                </Link>
              </td>
              <td className="px-4 py-3">{c.name}</td>
              <td className="px-4 py-3 font-semibold">{usd(c.accountSizeUsd)}</td>
              <td className="px-4 py-3">{usd(c.priceUsd)}</td>
              <td className="px-4 py-3">{usd(c.activationFeeUsd)}</td>
              <td className="px-4 py-3">{usd(c.profitTargetUsd)}</td>
              <td className="px-4 py-3">{usd(c.maxDrawdownUsd)}</td>
              <td className="px-4 py-3 text-muted">{c.drawdownType ? drawdownLabel[c.drawdownType] : "—"}</td>
              <td className="px-4 py-3">{c.maxContracts ?? "—"}</td>
              <td className="px-4 py-3">{c.profitSplitPct ? `${c.profitSplitPct}%` : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
