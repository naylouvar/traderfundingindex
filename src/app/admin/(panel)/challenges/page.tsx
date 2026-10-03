import Link from "next/link";
import { db } from "@/lib/db";
import { drawdownLabel, usd } from "@/lib/format";
import { PlanForm } from "../../_components/plan-form";

export default async function ChallengesAdmin({ searchParams }: PageProps<"/admin/challenges">) {
  const { saved } = await searchParams;
  const [plans, firms] = await Promise.all([
    db.plan.findMany({
      include: { firm: { select: { id: true, name: true } } },
      orderBy: [{ firm: { sortOrder: "asc" } }, { firm: { name: "asc" } }, { accountSizeUsd: "asc" }],
    }),
    db.firm.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true } }),
  ]);
  const firmOptions = Object.fromEntries(firms.map((f) => [f.id, f.name]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Challenges</h1>
        <p className="text-sm text-muted">
          Every plan across all firms. These fill the Challenges tab on the homepage. Click a firm to edit its plans.
        </p>
      </div>
      {saved && <p className="rounded-md bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">Challenge saved.</p>}
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Firm</th>
              <th className="px-4 py-3 font-medium">Challenge</th>
              <th className="px-4 py-3 font-medium">Account</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Drawdown</th>
              <th className="px-4 py-3 font-medium">Split</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted">
                  No challenges yet. Add one below.
                </td>
              </tr>
            )}
            {plans.map((p) => (
              <tr key={p.id} className="border-t border-white/10">
                <td className="px-4 py-3 font-medium">{p.firm.name}</td>
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{usd(p.accountSizeUsd)}</td>
                <td className="px-4 py-3">{usd(p.priceUsd)}</td>
                <td className="px-4 py-3 text-muted">{p.drawdownType ? drawdownLabel[p.drawdownType] : "—"}</td>
                <td className="px-4 py-3">{p.profitSplitPct ? `${p.profitSplitPct}%` : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/firms/${p.firm.id}#plans`} className="text-accent hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="space-y-4 rounded-lg border border-dashed border-white/20 p-5">
        <h2 className="text-lg font-semibold text-accent">Add a challenge</h2>
        {firms.length === 0 ? (
          <p className="text-sm text-muted">Add a firm first.</p>
        ) : (
          <PlanForm firmOptions={firmOptions} firmId={firms[0].id} returnTo="challenges" />
        )}
      </section>
    </div>
  );
}
