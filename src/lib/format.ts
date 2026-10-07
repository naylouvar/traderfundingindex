import type { DrawdownType, RuleCategory } from "@prisma/client";

export function usd(value: number | { toString(): string } | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `$${Number(value.toString()).toLocaleString("en-US")}`;
}

export const drawdownLabel: Record<DrawdownType, string> = {
  END_OF_DAY_TRAILING: "End-of-day trailing",
  INTRADAY_TRAILING: "Intraday trailing",
  STATIC: "Static",
};

export const ruleCategoryLabel: Record<RuleCategory, string> = {
  NEWS: "News trading",
  CONSISTENCY: "Consistency",
  CONTRACT_LIMIT: "Contract limit",
  TRADING_HOURS: "Trading hours",
  OVERNIGHT: "Overnight / weekend",
  AUTOMATION: "Automation / bots",
  IP_VPN: "IP / VPN",
  PAYOUT: "Payout",
  OTHER: "Other",
};

export function compactUsd(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value}`;
}
