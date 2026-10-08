import type { Metadata } from "next";
import Link from "next/link";
import { FirmLogo } from "@/components/firm-logo";
import { db } from "@/lib/db";
import { checkedLabel, payoutRulesLegend, type PayoutRuleField } from "@/lib/payout-rules";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Futures prop firm payout rules compared" };

const columns: { key: PayoutRuleField; label: string }[] = [
  { key: "minPayout", label: "Minimum payout" },
  { key: "consistency", label: "Consistency (funded)" },
  { key: "threshold", label: "Buffer or profit before payout" },
  { key: "minDays", label: "Days before payout" },
  { key: "withdrawalCaps", label: "Withdrawal caps" },
  { key: "newsTrading", label: "News trading" },
  { key: "automation", label: "Bots" },
  { key: "multipleAccounts", label: "Funded accounts" },
];

function countryList(value: string | null) {
  return (value ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

export default async function PayoutRulesPage({ searchParams }: PageProps<"/payout-rules">) {
  const { country } = await searchParams;
  const query = typeof country === "string" ? country.trim().slice(0, 60) : "";
  const firms = await db.firm.findMany({
    where: { assetClass: "FUTURES", status: { not: "CLOSED" }, payoutRules: { isNot: null } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { payoutRules: true },
  });

  const needle = query.toLowerCase();
  const restricting = query
    ? firms.filter((f) => countryList(f.payoutRules!.restrictedCountries).some((c) => c.toLowerCase() === needle))
    : [];
  const dates = [...new Set(firms.map((f) => checkedLabel(f.payoutRules!)).filter(Boolean))];

  return (
    <div className="space-y-8">
      <header className="max-w-3xl space-y-2">
        <h1 className="text-3xl font-semibold">Payout rules compared</h1>
        <p className="text-muted">
          What each futures prop firm asks before it pays a funded trader: minimum payout, consistency, buffers,
          winning days, caps, and what you may trade. {payoutRulesLegend}
        </p>
        <p className="text-sm text-muted">
          {dates.length > 0 && `Checked ${dates.join(", ")}. `}Rules change often, so confirm on the firm&apos;s own
          site before you buy.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Which firms accept traders from your country?</h2>
        <form className="flex max-w-md gap-2">
          <input
            name="country"
            type="search"
            defaultValue={query}
            placeholder="Country name, e.g. Morocco"
            aria-label="Country"
            className="input"
          />
          <button className="btn-secondary">Check</button>
        </form>
        {query && (
          <p className="text-sm">
            {restricting.length === 0 ? (
              <>None of the {firms.length} firms below lists “{query}” as restricted. Check the spelling, then confirm with the firm.</>
            ) : (
              <>
                <strong>
                  {restricting.length} of {firms.length} firms
                </strong>{" "}
                restrict “{query}”: {restricting.map((f) => f.name).join(", ")}.
              </>
            )}
          </p>
        )}
      </section>

      {firms.length === 0 ? (
        <p className="text-muted">No payout rules published yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[1400px] text-left align-top text-sm">
            <thead className="bg-white/5 text-muted">
              <tr>
                <th className="sticky left-0 bg-background px-4 py-3 font-medium">Firm</th>
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 font-medium">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 font-medium">Restricted countries</th>
              </tr>
            </thead>
            <tbody>
              {firms.map((firm) => {
                const rules = firm.payoutRules!;
                const restricted = restricting.includes(firm);
                return (
                  <tr key={firm.id} className={`border-t border-white/10 ${restricted ? "opacity-50" : ""}`}>
                    <td className="sticky left-0 bg-background px-4 py-3 align-top">
                      <Link
                        href={`/firms/${firm.slug}#payout-rules`}
                        className="flex items-center gap-2 font-medium hover:text-accent"
                      >
                        <FirmLogo name={firm.name} logoUrl={firm.logoUrl} size={24} />
                        {firm.name}
                      </Link>
                      {rules.plansCovered && <p className="mt-1 text-xs text-muted">{rules.plansCovered}</p>}
                    </td>
                    {columns.map((c) => (
                      <td key={c.key} className="max-w-xs px-4 py-3 align-top">
                        {rules[c.key] ?? "Not stated"}
                      </td>
                    ))}
                    <td className="px-4 py-3 align-top">{rules.restrictedCountryCount ?? "Not stated"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
