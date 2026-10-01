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
