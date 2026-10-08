// Imports funded-account and payout rules for futures prop firms from the newest
// file in prisma/data (payout-rules-YYYY-MM-DD.json). Sources: each firm's
// PropFirmMatch page, plus help centers or review sites where each firm's notes say.
// Trade The Pool (stocks) and E8 Perpetuals (crypto perpetuals) were in the source
// spreadsheets but are left out because they are not futures firms.
//
// Firms are matched by slug, then by name. Missing firms are created after the
// existing ones in the ranking. Safe to re-run after a new data file lands:
// - a firm without payout rules gets the full row;
// - on a firm that has them, each field is updated only if it is empty or still
//   holds a value from an earlier data file, so anything edited in the admin
//   panel is kept;
// - the firm's platform list is filled only when it is empty.
// Pass --force to overwrite every field with the newest data.
import { readdir, readFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";

const NEW_FIRM_SORT_ORDER = 100;
const FIELDS = [
  "plansCovered",
  "accountSizes",
  "platforms",
  "minPayout",
  "consistency",
  "threshold",
  "withdrawalCaps",
  "minDays",
  "winningDayMin",
  "newsTrading",
  "scalping",
  "automation",
  "multipleAccounts",
  "restrictedCountryCount",
  "restrictedCountries",
  "notes",
  "sourceUrl",
  "checkedOn",
];

const db = new PrismaClient();
const force = process.argv.includes("--force");
const dataDir = new URL("./data/", import.meta.url);
const files = (await readdir(dataDir)).filter((f) => /^payout-rules-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
const load = async (file) => JSON.parse(await readFile(new URL(file, dataDir), "utf8"));
const rows = await load(files.at(-1));

// Values written by earlier data files, per firm and field: still holding one of
// these means the admin has not changed that field since it was imported.
const earlier = new Map();
for (const file of files.slice(0, -1)) {
  for (const row of await load(file)) {
    const values = earlier.get(row.slug) ?? {};
    for (const field of FIELDS) {
      values[field] = [...(values[field] ?? []), key(field === "checkedOn" ? dateOf(file) : row[field])];
    }
    earlier.set(row.slug, values);
  }
}

function dateOf(file) {
  return file.match(/\d{4}-\d{2}-\d{2}/)[0];
}

// Comparable form of a value: dates by day only, since the admin form saves the
// end of the chosen day.
function key(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value ?? null;
}

let createdFirms = 0;
let createdRules = 0;
let updatedRules = 0;
let keptFields = 0;
let filledPlatforms = 0;

for (const { name, slug, firmPlatforms, checkedOn, ...rest } of rows) {
  const incoming = { ...rest, checkedOn: new Date(`${checkedOn}T12:00:00Z`) };

  let firm = (await db.firm.findUnique({ where: { slug } })) ?? (await db.firm.findFirst({ where: { name } }));
  if (!firm) {
    firm = await db.firm.create({ data: { name, slug, assetClass: "FUTURES", sortOrder: NEW_FIRM_SORT_ORDER } });
    createdFirms++;
  }
  if (!firm.platforms) {
    await db.firm.update({ where: { id: firm.id }, data: { platforms: firmPlatforms ?? incoming.platforms } });
    filledPlatforms++;
  }

  const existing = await db.payoutRules.findUnique({ where: { firmId: firm.id } });
  if (!existing) {
    await db.payoutRules.create({ data: { ...incoming, firmId: firm.id } });
    createdRules++;
    continue;
  }

  const previous = earlier.get(slug) ?? {};
  const data = {};
  for (const field of FIELDS) {
    const current = key(existing[field]);
    const next = key(incoming[field]);
    if (current === next) continue;
    if (force || current === null || (previous[field] ?? []).includes(current)) data[field] = incoming[field] ?? null;
    else keptFields++;
  }
  if (Object.keys(data).length > 0) {
    await db.payoutRules.update({ where: { firmId: firm.id }, data });
    updatedRules++;
  }
}

console.log(
  `Payout rules from ${files.at(-1)}: ${createdRules} added, ${updatedRules} updated, ` +
    `${keptFields} admin-edited fields kept, ${createdFirms} new firms, ${filledPlatforms} platform lists filled`,
);
await db.$disconnect();
