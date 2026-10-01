// Seeds the firms the founder has traded with first-hand.
// Plan, rule and country data is added through the admin panel once verified.
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

console.log(`Seeded ${firms.length} firms`);
await db.$disconnect();
