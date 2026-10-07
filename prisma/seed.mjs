// Seeds the firms the founder has traded with first-hand, plus fine-print
// findings taken word for word from a firm's own published help articles.
// Other plan, rule and country data is added through the admin panel once verified.
// Safe to re-run: existing rows are left as they are, so admin edits survive.
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const firms = [
  { name: "Topstep", slug: "topstep" },
  { name: "OneUp Trader", slug: "oneup-trader" },
  { name: "Earn2Trade", slug: "earn2trade" },
  { name: "TickTickTrader", slug: "tickticktrader" },
  { name: "Apex Trader Funding", slug: "apex-trader-funding" },
  { name: "Leeloo Trading", slug: "leeloo-trading" },
  { name: "Goat Funded", slug: "goat-funded" },
];

for (const firm of firms) {
  await db.firm.upsert({
    where: { slug: firm.slug },
    update: {},
    create: { ...firm, assetClass: "FUTURES" },
  });
}

// Blueberry Futures: "How is the payout cycle structured?" help article (dated December 21, 2025).
const blueberry = await db.firm.upsert({
  where: { slug: "blueberry-futures" },
  update: {},
  create: { name: "Blueberry Futures", slug: "blueberry-futures", assetClass: "FUTURES" },
});

const blueberryRules = [
  {
    id: "seed-blueberry-buffer",
    category: "PAYOUT",
    severity: "HIGH",
    title: "You must leave a buffer behind, and on the $150K it is bigger than the max payout",
    text:
      "You can only withdraw funds in excess of your Required Buffer, up to the Maximum Cap. " +
      "Buffer that must remain after payout: $1,100 (25K), $2,100 (50K), $3,100 (100K), $4,600 (150K). " +
      "Maximum payout: $1,500 (25K), $2,500 (50K), $3,500 (100K), $4,500 (150K). " +
      "Minimum payout: $250, $500, $750, $1,000.",
    impact: [
      "- **Profit needed before your first full payout:** $2,600 on 25K, $4,600 on 50K, $6,600 on 100K, $9,100 on 150K.",
      "- **Share of that profit you actually take home:** about 58% on 25K, 54% on 50K, 53% on 100K and only 49% on 150K. The rest stays locked as buffer.",
      "- **Profit needed to withdraw anything at all:** $1,350 on 25K, $2,600 on 50K, $3,850 on 100K, $5,600 on 150K (buffer plus minimum payout).",
      "- **The $150K is the odd one out:** the buffer grows by $1,000 per size up to 100K, then jumps by $1,500, so the amount you must leave behind ($4,600) is larger than the most you can ever withdraw in one go ($4,500).",
      "- The article does not say the buffer is ever paid out. If the account later hits its drawdown, that profit is gone.",
    ].join("\n"),
  },
  {
    id: "seed-blueberry-consistency",
    category: "CONSISTENCY",
    severity: "HIGH",
    title: "One great day can block your payout",
    text:
      "No single day can account for more than a specific % of your total profit: " +
      "Accelerated max 20% from a single day, Ascent max 35% from a single day.",
    impact: [
      "- Your total profit in the cycle must be at least **5x your best day** on Accelerated, or about **2.9x** on Ascent.",
      "- Example: one $1,000 day on Accelerated means you need $5,000 of profit in the cycle before you can request anything, more than the full buffer plus max payout on a 50K.",
      "- To reach the $2,600 needed for a full 25K payout on Accelerated, no single day may exceed $520.",
      "- A big day forces you to keep trading to dilute it, which keeps you exposed to the drawdown for longer.",
      "- The article does not say whether losing days reduce the \"total profit\" used in this calculation. If they do, the rule is even stricter.",
    ].join("\n"),
  },
  {
    id: "seed-blueberry-profitable-days",
    category: "PAYOUT",
    severity: "MEDIUM",
    title: "Days under $200 do not count, but losing days still cost you",
    text:
      "You must have traded at least 5 profitable days. A day is only counted if you generate a net profit of $200 or more. " +
      "Days with less than $200 profit do not count.",
    impact: [
      "- A $150 winning day does nothing for your day count, while a $150 losing day still eats into your profit and your buffer.",
      "- With the 20% consistency rule on Accelerated, five $200 days only qualify if they are perfectly equal, so in practice expect to need more than five winning days.",
      "- Small, steady scalping days, often the safest way to trade a funded account, are exactly the days this rule ignores.",
    ].join("\n"),
  },
  {
    id: "seed-blueberry-cycle-reset",
    category: "PAYOUT",
    severity: "MEDIUM",
    title: "Every payout freezes the account and restarts the count",
    text:
      "Once you request a payout, your account is temporarily paused (read-only) while the funds are processed. " +
      "After a payout, your 5 Day Count resets. You must complete 5 new profitable days and maintain consistency within the new cycle to qualify for the next withdrawal.",
    impact: [
      "- You cannot trade while a payout is processed, and the article gives no processing time.",
      "- Each new payout needs 5 fresh $200+ days and a fresh consistency check, so at best you get one payout per five qualifying days plus processing time.",
      "- The cap applies per cycle, so even a very profitable cycle pays out at most $1,500 to $4,500 depending on account size.",
    ].join("\n"),
  },
];

for (const rule of blueberryRules) {
  await db.rule.upsert({
    where: { id: rule.id },
    update: {},
    create: { ...rule, firmId: blueberry.id, hidden: true },
  });
}

console.log(`Seeded ${firms.length + 1} firms and ${blueberryRules.length} Blueberry Futures rules`);
await db.$disconnect();
