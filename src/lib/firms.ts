import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

// Firms with the figures the ranking table needs, computed from their plans
// and approved reviews. Ranking: the admin's sort order, then rating (reviews,
// or the editor rating until reviews exist), review count, how complete the
// firm's data is, then name.

export type RankedFirm = Awaited<ReturnType<typeof getRankedFirms>>[number];

export async function getRankedFirms(where: Prisma.FirmWhereInput = {}) {
  const firms = await db.firm.findMany({
    where: { assetClass: "FUTURES", status: { not: "CLOSED" }, ...where },
    include: {
      plans: { select: { accountSizeUsd: true, priceUsd: true, profitSplitPct: true, drawdownType: true } },
      reviews: { where: { moderation: "APPROVED" }, select: { overall: true } },
      countryRules: { where: { status: "BANNED" }, select: { countryCode: true } },
    },
  });

  const ranked = firms.map((firm) => {
    const ratings = firm.reviews.map((r) => r.overall);
    const prices = firm.plans.flatMap((p) => (p.priceUsd === null ? [] : [Number(p.priceUsd)]));
    const splits = firm.plans.flatMap((p) => (p.profitSplitPct === null ? [] : [p.profitSplitPct]));
    const reviewRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
    const editorRating = firm.editorRating === null ? null : Number(firm.editorRating);
    return {
      ...firm,
      editorRating,
      rating: reviewRating ?? editorRating,
      ratingSource: (reviewRating !== null ? "reviews" : editorRating !== null ? "editor" : null) as
        | "reviews"
        | "editor"
        | null,
      reviewCount: ratings.length,
      maxAllocationUsd: firm.plans.length ? Math.max(...firm.plans.map((p) => p.accountSizeUsd)) : null,
      minPriceUsd: prices.length ? Math.min(...prices) : null,
      maxSplitPct: splits.length ? Math.max(...splits) : null,
      drawdownType: firm.plans.find((p) => p.drawdownType)?.drawdownType ?? null,
      yearsInOperation: firm.foundedYear ? new Date().getFullYear() - firm.foundedYear : null,
      platformList: (firm.platforms ?? "").split(",").map((p) => p.trim()).filter(Boolean),
      bannedCount: firm.countryRules.length,
    };
  });

  return ranked.sort(
    (a, b) =>
      a.sortOrder - b.sortOrder ||
      (b.rating ?? -1) - (a.rating ?? -1) ||
      b.reviewCount - a.reviewCount ||
      b.plans.length - a.plans.length ||
      a.name.localeCompare(b.name),
  );
}

export async function getSiteStats() {
  const [firms, reviews, payouts, rules] = await Promise.all([
    db.firm.count({ where: { assetClass: "FUTURES", status: { not: "CLOSED" } } }),
    db.review.count({ where: { moderation: "APPROVED" } }),
    db.payoutReport.count(),
    db.rule.count({ where: { hidden: true } }),
  ]);
  return { firms, reviews, payouts, rules };
}

export function hasActiveOffer(firm: { promoCode: string | null; promoEndsAt: Date | null }) {
  return Boolean(firm.promoCode) && (!firm.promoEndsAt || firm.promoEndsAt > new Date());
}

export async function getChallenges() {
  return db.plan.findMany({
    where: { firm: { assetClass: "FUTURES", status: { not: "CLOSED" } } },
    include: { firm: { select: { name: true, slug: true, logoUrl: true } } },
    orderBy: [{ firm: { sortOrder: "asc" } }, { firm: { name: "asc" } }, { accountSizeUsd: "asc" }],
  });
}

export async function getApprovedReviews(take = 30) {
  return db.review.findMany({
    where: { moderation: "APPROVED" },
    include: { firm: { select: { name: true, slug: true, logoUrl: true } }, user: { select: { handle: true } } },
    orderBy: { createdAt: "desc" },
    take,
  });
}
