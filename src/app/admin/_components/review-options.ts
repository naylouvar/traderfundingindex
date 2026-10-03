import "server-only";
import { db } from "@/lib/db";
import { usd } from "@/lib/format";

export async function reviewOptions() {
  const firms = await db.firm.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { plans: { orderBy: { accountSizeUsd: "asc" } } },
  });
  return {
    firmOptions: Object.fromEntries(firms.map((f) => [f.id, f.name])),
    planOptions: Object.fromEntries(
      firms.flatMap((f) => f.plans.map((p) => [p.id, `${f.name}: ${p.name} (${usd(p.accountSizeUsd)})`])),
    ),
  };
}
