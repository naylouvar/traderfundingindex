import type { PayoutRules } from "@prisma/client";
import { checkedLabel, payoutRuleFields, payoutRulesLegend } from "@/lib/payout-rules";

export function PayoutRulesSection({ firmName, rules }: { firmName: string; rules: PayoutRules }) {
  const checked = checkedLabel(rules);
  const fields = payoutRuleFields.filter((f) => rules[f.key]);

  return (
    <section id="payout-rules" className="scroll-mt-6 space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Funded account and payout rules</h2>
        <p className="text-sm text-muted">
          What {firmName} asks before it pays you, plan by plan. {payoutRulesLegend}
        </p>
      </div>

      <dl className="divide-y divide-white/10 rounded-lg border border-white/10 text-sm">
        {fields.map((f) => (
          <div key={f.key} className="grid gap-1 px-4 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
            <dt className="font-medium text-muted">{f.label}</dt>
            <dd className="whitespace-pre-line">{rules[f.key]}</dd>
          </div>
        ))}
      </dl>

      {rules.notes && (
        <p className="rounded-md border border-amber-400/30 bg-amber-400/5 px-4 py-3 text-sm">
          <strong className="mr-1">Sources and conflicts:</strong>
          {rules.notes}
        </p>
      )}

      <p className="text-xs text-muted">
        {checked ? `Checked ${checked}. ` : ""}Prop firm rules change often, so confirm on {firmName}&apos;s own site
        before you buy.
        {rules.sourceUrl && (
          <>
            {" "}
            <a href={rules.sourceUrl} rel="nofollow noopener" className="underline">
              Source
            </a>
          </>
        )}
      </p>
    </section>
  );
}
