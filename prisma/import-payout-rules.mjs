// Imports funded-account and payout rules for 23 futures prop firms from
// prisma/data/payout-rules-2026-10-07.json (PropFirmMatch pages, checked 7 Oct 2026,
// with gaps filled from help centers or review sites as each firm's notes say).
// Trade The Pool (stocks) and E8 Perpetuals (crypto perpetuals) were in the source
// spreadsheet but are left out because they are not futures firms.
//
// Firms are matched by slug, then by name. Missing firms are created after the
// existing ones in the ranking. A firm that already has payout rules is skipped,
// so edits made in the admin panel survive re-runs. Pass --force to overwrite them.
import { readFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";

const CHECKED_ON = new Date("2026-10-07T12:00:00Z");
const NEW_FIRM_SORT_ORDER = 100;

const db = new PrismaClient();
const force = process.argv.includes("--force");
const rows = JSON.parse(await readFile(new URL("./data/payout-rules-2026-10-07.json", import.meta.url), "utf8"));

let created = 0;
let imported = 0;
let skipped = 0;

for (const { name, slug, ...rules } of rows) {
  let firm =
    (await db.firm.findUnique({ where: { slug } })) ?? (await db.firm.findFirst({ where: { name } }));
  if (!firm) {
    firm = await db.firm.create({
      data: { name, slug, assetClass: "FUTURES", sortOrder: NEW_FIRM_SORT_ORDER },
    });
    created++;
  }

  const existing = await db.payoutRules.findUnique({ where: { firmId: firm.id } });
  if (existing && !force) {
    skipped++;
    continue;
  }
  const data = { ...rules, checkedOn: CHECKED_ON };
  await db.payoutRules.upsert({ where: { firmId: firm.id }, update: data, create: { ...data, firmId: firm.id } });
  imported++;
}

console.log(
  `Payout rules: ${imported} imported, ${skipped} already present (kept), ${created} new firms created`,
);
await db.$disconnect();
