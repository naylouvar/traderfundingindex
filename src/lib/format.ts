import type { DrawdownType } from "@prisma/client";

export function usd(value: number | { toString(): string } | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `$${Number(value.toString()).toLocaleString("en-US")}`;
}

export const drawdownLabel: Record<DrawdownType, string> = {
  END_OF_DAY_TRAILING: "End-of-day trailing",
  INTRADAY_TRAILING: "Intraday trailing",
  STATIC: "Static",
};

export function compactUsd(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value}`;
}
