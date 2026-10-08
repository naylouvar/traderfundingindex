import type { PayoutRules } from "@prisma/client";

// The free-text payout rule fields, in display order, with the labels used on
// the firm page, the comparison page and the admin form.

export type PayoutRuleField = keyof Pick<
  PayoutRules,
  | "plansCovered"
  | "accountSizes"
  | "platforms"
  | "minPayout"
  | "consistency"
  | "threshold"
  | "withdrawalCaps"
  | "minDays"
  | "winningDayMin"
  | "newsTrading"
  | "scalping"
  | "automation"
  | "multipleAccounts"
>;

export const payoutRuleFields: { key: PayoutRuleField; label: string; hint?: string }[] = [
  { key: "plansCovered", label: "Funded plans covered" },
  { key: "accountSizes", label: "Account sizes" },
  { key: "platforms", label: "Trading platforms", hint: "ATAS means ATAS Orderflow Trading." },
  { key: "minPayout", label: "Minimum payout" },
  {
    key: "consistency",
    label: "Consistency rule (funded)",
    hint: "Your best day may not exceed this share of total profit when you request a payout.",
  },
  { key: "threshold", label: "Buffer or profit needed before a payout" },
  { key: "withdrawalCaps", label: "Withdrawal caps", hint: "Per request unless stated otherwise." },
  { key: "minDays", label: "Days required before a payout" },
  { key: "winningDayMin", label: "Profit needed for a winning day" },
  { key: "newsTrading", label: "News trading" },
  { key: "scalping", label: "Scalping" },
  { key: "automation", label: "Bots and automation" },
  { key: "multipleAccounts", label: "Multiple funded accounts" },
];

export const payoutRulesLegend =
  'Amounts separated by " / " follow account size order, usually 25K / 50K / 100K / 150K, unless stated. ' +
  '"Not stated" means no source gave the value. "None" means the firm has no such rule. ' +
  '"Evaluation only" means the rule stops applying once you are funded.';

export function checkedLabel(rules: Pick<PayoutRules, "checkedOn">) {
  return rules.checkedOn
    ? rules.checkedOn.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    : null;
}
