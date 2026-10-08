"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { EDITABLE_SECTIONS, getContent, type EditableSection } from "@/lib/content";
import { saveImage, UploadError } from "@/lib/uploads";
import { site } from "@/content/site";
import { payoutRuleFields } from "@/lib/payout-rules";
import { defaultPages, RESERVED_SLUGS } from "@/content/pages";
import { listPages } from "@/lib/pages";
import { createSession, destroySession, passwordMatches, requireAdmin } from "@/lib/auth";
import { date, decimal, int, oneOf, requiredText, slugify, text } from "@/lib/form";

const FIRM_STATUSES = ["ACTIVE", "UNDER_WATCH", "CLOSED"] as const;
const ASSET_CLASSES = ["FUTURES", "FOREX", "CRYPTO"] as const;
const DRAWDOWN_TYPES = ["END_OF_DAY_TRAILING", "INTRADAY_TRAILING", "STATIC"] as const;
const RULE_CATEGORIES = [
  "NEWS",
  "CONSISTENCY",
  "CONTRACT_LIMIT",
  "TRADING_HOURS",
  "OVERNIGHT",
  "AUTOMATION",
  "IP_VPN",
  "PAYOUT",
  "OTHER",
] as const;
const SEVERITIES = ["LOW", "MEDIUM", "HIGH"] as const;
const COUNTRY_STATUSES = ["ALLOWED", "RESTRICTED", "BANNED"] as const;

function refresh(slug?: string) {
  revalidatePath("/admin", "layout");
  revalidatePath("/");
  revalidatePath("/firms");
  if (slug) revalidatePath(`/firms/${slug}`);
}

// Login

export async function login(_state: string | null, form: FormData) {
  if (!passwordMatches(text(form, "password") ?? "")) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // slow down guessing
    return "Wrong password.";
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// Firms

function firmData(form: FormData) {
  const name = requiredText(form, "name");
  const hqCountry = text(form, "hqCountry");
  return {
    name,
    slug: slugify(text(form, "slug") ?? name),
    website: text(form, "website"),
    foundedYear: int(form, "foundedYear"),
    hqCountry: hqCountry ? hqCountry.toUpperCase().slice(0, 2) : null,
    assetClass: oneOf(form, "assetClass", ASSET_CLASSES) ?? "FUTURES",
    status: oneOf(form, "status", FIRM_STATUSES) ?? "ACTIVE",
    platforms: text(form, "platforms"),
    description: text(form, "description"),
    logoUrl: text(form, "logoUrl"),
    featured: form.get("featured") === "on",
    promoCode: text(form, "promoCode"),
    promoDiscountPct: int(form, "promoDiscountPct"),
    promoUrl: text(form, "promoUrl"),
    promoEndsAt: date(form, "promoEndsAt"),
    sortOrder: int(form, "sortOrder") ?? 0,
    editorRating: rating(form, "editorRating"),
  };
}

function rating(form: FormData, key: string) {
  const value = text(form, key);
  if (value === null) return null;
  const parsed = Number(value.replace(",", "."));
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 5) throw new Error(`${key} must be between 0 and 5`);
  return parsed.toFixed(1);
}

// Returns the new logo URL, null to clear it, or undefined to leave it as is.
async function logoFromForm(form: FormData, slug: string) {
  const file = form.get("logoFile");
  if (file instanceof File && file.size > 0) return saveImage(file, slug);
  if (form.get("removeLogo") === "on") return null;
  return undefined;
}

function isDuplicateSlug(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function createFirm(form: FormData) {
  await requireAdmin();
  let id: string;
  try {
    const firm = await db.firm.create({ data: firmData(form) });
    refresh(firm.slug);
    id = firm.id;
  } catch (error) {
    if (isDuplicateSlug(error)) redirect("/admin/firms/new?error=slug");
    throw error;
  }
  redirect(`/admin/firms/${id}`);
}

export async function updateFirm(form: FormData) {
  await requireAdmin();
  const id = requiredText(form, "id");
  const before = await db.firm.findUniqueOrThrow({ where: { id } });
  const data = firmData(form);
  try {
    const logo = await logoFromForm(form, data.slug);
    if (logo !== undefined) data.logoUrl = logo;
  } catch (error) {
    if (error instanceof UploadError) redirect(`/admin/firms/${id}?error=logo`);
    throw error;
  }
  try {
    const firm = await db.firm.update({ where: { id }, data });
    refresh(before.slug);
    refresh(firm.slug);
  } catch (error) {
    if (isDuplicateSlug(error)) redirect(`/admin/firms/${id}?error=slug`);
    throw error;
  }
  redirect(`/admin/firms/${id}?saved=firm`);
}

export async function markVerified(form: FormData) {
  await requireAdmin();
  const id = requiredText(form, "id");
  const firm = await db.firm.update({ where: { id }, data: { lastVerifiedAt: new Date() } });
  refresh(firm.slug);
  redirect(`/admin/firms/${id}?saved=verified`);
}

export async function deleteFirm(form: FormData) {
  await requireAdmin();
  const id = requiredText(form, "id");
  if (text(form, "confirm") !== "delete") {
    redirect(`/admin/firms/${id}?error=confirm`);
  }
  const firm = await db.firm.delete({ where: { id } });
  refresh(firm.slug);
  redirect("/admin");
}

// Plans. Changes to an existing plan are written to the change log, which
// powers the public "rules changed after purchase" history.

function planData(form: FormData) {
  const accountSizeUsd = int(form, "accountSizeUsd");
  if (accountSizeUsd === null) throw new Error("accountSizeUsd is required");
  return {
    name: requiredText(form, "name"),
    assetClass: oneOf(form, "assetClass", ASSET_CLASSES) ?? "FUTURES",
    accountSizeUsd,
    priceUsd: decimal(form, "priceUsd"),
    activationFeeUsd: decimal(form, "activationFeeUsd"),
    resetFeeUsd: decimal(form, "resetFeeUsd"),
    dataFeeUsd: decimal(form, "dataFeeUsd"),
    phases: int(form, "phases"),
    profitTargetUsd: int(form, "profitTargetUsd"),
    maxDrawdownUsd: int(form, "maxDrawdownUsd"),
    dailyLossLimitUsd: int(form, "dailyLossLimitUsd"),
    drawdownType: oneOf(form, "drawdownType", DRAWDOWN_TYPES),
    maxContracts: int(form, "maxContracts"),
    minTradingDays: int(form, "minTradingDays"),
    profitSplitPct: int(form, "profitSplitPct"),
    payoutFrequency: text(form, "payoutFrequency"),
    scalingNotes: text(form, "scalingNotes"),
  };
}

function display(value: unknown) {
  if (value === null || value === undefined) return null;
  return value.toString();
}

export async function savePlan(form: FormData) {
  await requireAdmin();
  const firmId = requiredText(form, "firmId");
  const id = text(form, "id");
  const data = planData(form);
  const firm = await db.firm.findUniqueOrThrow({ where: { id: firmId } });

  if (!id) {
    await db.plan.create({ data: { ...data, firmId } });
  } else {
    const before = await db.plan.findUniqueOrThrow({ where: { id } });
    const changes = Object.entries(data)
      .filter(([field, value]) => display(before[field as keyof typeof before]) !== display(value))
      .map(([field, value]) => ({
        planId: id,
        field,
        oldValue: display(before[field as keyof typeof before]),
        newValue: display(value),
        changedOn: new Date(),
        sourceUrl: text(form, "sourceUrl"),
      }));
    await db.$transaction([
      db.plan.update({ where: { id }, data }),
      db.ruleChange.createMany({ data: changes }),
    ]);
  }
  refresh(firm.slug);
  redirect(text(form, "returnTo") === "challenges" ? "/admin/challenges?saved=1" : `/admin/firms/${firmId}?saved=plan#plans`);
}

export async function deletePlan(form: FormData) {
  await requireAdmin();
  const id = requiredText(form, "id");
  const plan = await db.plan.delete({ where: { id }, include: { firm: true } });
  refresh(plan.firm.slug);
  redirect(`/admin/firms/${plan.firmId}?saved=plan#plans`);
}

// Payout rules

export async function savePayoutRules(form: FormData) {
  await requireAdmin();
  const firmId = requiredText(form, "firmId");
  const firm = await db.firm.findUniqueOrThrow({ where: { id: firmId } });
  const data = {
    ...Object.fromEntries(payoutRuleFields.map((f) => [f.key, text(form, f.key)])),
    restrictedCountryCount: int(form, "restrictedCountryCount"),
    restrictedCountries: text(form, "restrictedCountries"),
    notes: text(form, "notes"),
    sourceUrl: text(form, "sourceUrl"),
    checkedOn: date(form, "checkedOn"),
  };
  await db.payoutRules.upsert({ where: { firmId }, update: data, create: { ...data, firmId } });
  refresh(firm.slug);
  revalidatePath("/payout-rules");
  redirect(`/admin/firms/${firmId}?saved=payout#payout-rules`);
}

export async function deletePayoutRules(form: FormData) {
  await requireAdmin();
  const firmId = requiredText(form, "firmId");
  const firm = await db.firm.findUniqueOrThrow({ where: { id: firmId } });
  await db.payoutRules.deleteMany({ where: { firmId } });
  refresh(firm.slug);
  revalidatePath("/payout-rules");
  redirect(`/admin/firms/${firmId}?saved=payout#payout-rules`);
}

// Rules

export async function saveRule(form: FormData) {
  await requireAdmin();
  const firmId = requiredText(form, "firmId");
  const id = text(form, "id");
  const data = {
    planId: text(form, "planId"),
    category: oneOf(form, "category", RULE_CATEGORIES) ?? "OTHER",
    severity: oneOf(form, "severity", SEVERITIES) ?? "MEDIUM",
    title: text(form, "title"),
    text: requiredText(form, "text"),
    impact: text(form, "impact"),
    hidden: form.get("hidden") === "on",
    sourceUrl: text(form, "sourceUrl"),
  };
  const firm = await db.firm.findUniqueOrThrow({ where: { id: firmId } });

  if (!id) {
    await db.rule.create({ data: { ...data, firmId } });
  } else {
    const before = await db.rule.findUniqueOrThrow({ where: { id } });
    await db.$transaction([
      db.rule.update({ where: { id }, data }),
      ...(before.text !== data.text
        ? [
            db.ruleChange.create({
              data: {
                ruleId: id,
                field: "text",
                oldValue: before.text,
                newValue: data.text,
                changedOn: new Date(),
                sourceUrl: data.sourceUrl,
              },
            }),
          ]
        : []),
    ]);
  }
  refresh(firm.slug);
  redirect(`/admin/firms/${firmId}?saved=rule#rules`);
}

export async function deleteRule(form: FormData) {
  await requireAdmin();
  const id = requiredText(form, "id");
  const rule = await db.rule.delete({ where: { id }, include: { firm: true } });
  refresh(rule.firm.slug);
  redirect(`/admin/firms/${rule.firmId}?saved=rule#rules`);
}

// Countries

export async function saveCountryRule(form: FormData) {
  await requireAdmin();
  const firmId = requiredText(form, "firmId");
  const countryCode = requiredText(form, "countryCode").toUpperCase();
  if (!/^[A-Z]{2}$/.test(countryCode)) {
    redirect(`/admin/firms/${firmId}?error=country#countries`);
  }
  const data = {
    status: oneOf(form, "status", COUNTRY_STATUSES) ?? "BANNED",
    note: text(form, "note"),
    sourceUrl: text(form, "sourceUrl"),
  };
  const firm = await db.firm.findUniqueOrThrow({ where: { id: firmId } });
  await db.countryRule.upsert({
    where: { firmId_countryCode: { firmId, countryCode } },
    create: { ...data, firmId, countryCode },
    update: data,
  });
  refresh(firm.slug);
  redirect(`/admin/firms/${firmId}?saved=country#countries`);
}

export async function deleteCountryRule(form: FormData) {
  await requireAdmin();
  const id = requiredText(form, "id");
  const rule = await db.countryRule.delete({ where: { id }, include: { firm: true } });
  refresh(rule.firm.slug);
  redirect(`/admin/firms/${rule.firmId}?saved=country#countries`);
}


// Firm order

async function rankedIds() {
  const firms = await db.firm.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true } });
  return firms.map((f) => f.id);
}

async function writeOrder(ids: string[]) {
  await db.$transaction(ids.map((id, i) => db.firm.update({ where: { id }, data: { sortOrder: i + 1 } })));
  refresh();
}

export async function saveFirmOrder(form: FormData) {
  await requireAdmin();
  const ids = await rankedIds();
  const position = (id: string) => int(form, `order_${id}`) ?? ids.indexOf(id) + 1;
  // On a tie, the firm whose position was just changed takes the spot.
  const moved = (id: string) => (position(id) !== ids.indexOf(id) + 1 ? 0 : 1);
  const sorted = [...ids].sort(
    (a, b) => position(a) - position(b) || moved(a) - moved(b) || ids.indexOf(a) - ids.indexOf(b),
  );
  await writeOrder(sorted);
  redirect("/admin?saved=order");
}

export async function moveFirm(id: string, direction: "up" | "down") {
  await requireAdmin();
  const ids = await rankedIds();
  const i = ids.indexOf(id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i >= 0 && j >= 0 && j < ids.length) [ids[i], ids[j]] = [ids[j], ids[i]];
  await writeOrder(ids);
  redirect("/admin?saved=order");
}

// Offers

export async function saveOffer(form: FormData) {
  await requireAdmin();
  const id = requiredText(form, "id");
  const firm = await db.firm.update({
    where: { id },
    data: {
      promoCode: text(form, "promoCode"),
      promoDiscountPct: int(form, "promoDiscountPct"),
      promoUrl: text(form, "promoUrl"),
      promoEndsAt: date(form, "promoEndsAt"),
      featured: form.get("featured") === "on",
    },
  });
  refresh(firm.slug);
  redirect("/admin/offers?saved=1");
}

// Reviews

const OUTCOMES = ["FAILED", "PASSED", "PAID", "DENIED"] as const;
const MODERATION = ["PENDING", "APPROVED", "REJECTED"] as const;

function score(form: FormData, key: string) {
  const value = int(form, key);
  if (value === null) return null;
  if (value < 1 || value > 5) throw new Error(`${key} must be 1 to 5`);
  return value;
}

export async function saveReview(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  const overall = score(form, "overall");
  if (overall === null) throw new Error("overall is required");
  const data = {
    firmId: requiredText(form, "firmId"),
    planId: text(form, "planId"),
    authorName: text(form, "authorName"),
    title: text(form, "title"),
    outcome: oneOf(form, "outcome", OUTCOMES) ?? "PASSED",
    overall,
    payoutReliability: score(form, "payoutReliability"),
    ruleFairness: score(form, "ruleFairness"),
    support: score(form, "support"),
    transparency: score(form, "transparency"),
    body: requiredText(form, "body"),
    verified: form.get("verified") === "on",
    moderation: oneOf(form, "moderation", MODERATION) ?? "APPROVED",
  };
  const review = id
    ? await db.review.update({ where: { id }, data, include: { firm: true } })
    : await db.review.create({ data, include: { firm: true } });
  refresh(review.firm.slug);
  redirect(`/admin/reviews?saved=1`);
}

export async function setReviewStatus(form: FormData) {
  await requireAdmin();
  const id = requiredText(form, "id");
  const moderation = oneOf(form, "moderation", MODERATION) ?? "PENDING";
  const review = await db.review.update({ where: { id }, data: { moderation }, include: { firm: true } });
  refresh(review.firm.slug);
  redirect(`/admin/reviews?saved=1&status=${text(form, "filter") ?? ""}`);
}

export async function deleteReview(form: FormData) {
  await requireAdmin();
  const id = requiredText(form, "id");
  const review = await db.review.delete({ where: { id }, include: { firm: true } });
  refresh(review.firm.slug);
  redirect("/admin/reviews?saved=1");
}

// Homepage text. Each field is named "<section>.<key>"; list sections (pillars,
// faq) use "<section>.<index>.<key>" and drop rows left empty.

function sectionValue(section: EditableSection, form: FormData) {
  const base = site[section];
  if (Array.isArray(base)) return listValue(section, form);
  const value: Record<string, unknown> = {};
  for (const key of Object.keys(base)) {
    const field = `${section}.${key}`;
    const current = (base as Record<string, unknown>)[key];
    if (key === "items" && section === "faq") {
      value.items = listValue("faq.items", form);
    } else if (key === "columns" && section === "footer") {
      value.columns = listValue("footer.columns", form)
        .filter((col) => col.title)
        .map((col) => ({ title: col.title, links: parseLinks(col.links ?? "") }));
    } else if (Array.isArray(current) && form.has(`${field}[]`)) {
      value[key] = form.getAll(`${field}[]`).map((v) => String(v).trim());
    } else if (form.has(field)) {
      value[key] = String(form.get(field) ?? "").trim();
    }
  }
  return value;
}

// "Label | /link" per line; a line without a link becomes a greyed-out item.
function parseLinks(textValue: string) {
  return textValue
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const at = line.lastIndexOf("|");
      if (at < 0) return { label: line, href: null };
      const href = line.slice(at + 1).trim();
      return { label: line.slice(0, at).trim(), href: href || null };
    })
    .filter((link) => link.label);
}

const SOCIAL_KEYS = ["x", "discord", "youtube", "telegram", "instagram"];

async function cleanSection(section: EditableSection, value: unknown, form: FormData) {
  if (section === "nav") {
    return (value as Record<string, string>[])
      .filter((item) => item.label)
      .map((item) => ({ label: item.label, href: item.href || null, ...(item.note ? { note: item.note } : {}) }));
  }
  const record = value as Record<string, unknown>;
  if (section === "footer") {
    for (const key of SOCIAL_KEYS) {
      const url = String(record[key] ?? "");
      if (url && !/^https?:\/\/\S+$/.test(url)) record[key] = "";
    }
  }
  if (section === "brand") {
    const current = (await getContent()).brand.logoUrl;
    const file = form.get("brand.logoFile");
    if (file instanceof File && file.size > 0) record.logoUrl = await saveImage(file, "site-logo");
    else record.logoUrl = form.get("brand.removeLogo") === "on" ? "" : current;
  }
  return record;
}

function listValue(prefix: string, form: FormData) {
  const rows = new Map<number, Record<string, string>>();
  for (const [name, raw] of form.entries()) {
    const match = name.match(new RegExp(`^${prefix.replaceAll(".", "\\.")}\\.(\\d+)\\.(\\w+)$`));
    if (!match || typeof raw !== "string") continue;
    const row = rows.get(Number(match[1])) ?? {};
    row[match[2]] = raw.trim();
    rows.set(Number(match[1]), row);
  }
  return [...rows.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, row]) => row)
    .filter((row) => Object.values(row).some(Boolean));
}

export async function saveSection(form: FormData) {
  await requireAdmin();
  const section = text(form, "section") as EditableSection | null;
  if (!section || !EDITABLE_SECTIONS.includes(section)) throw new Error("Unknown section");
  const returnTo = text(form, "returnTo") === "/admin/site" ? "/admin/site" : "/admin/homepage";
  if (form.get("reset") === "on") {
    await db.siteSetting.deleteMany({ where: { key: section } });
  } else {
    let value: Prisma.InputJsonValue;
    try {
      value = (await cleanSection(section, sectionValue(section, form), form)) as Prisma.InputJsonValue;
    } catch (error) {
      if (error instanceof UploadError) redirect(`${returnTo}?error=logo#${section}`);
      throw error;
    }
    await db.siteSetting.upsert({ where: { key: section }, create: { key: section, value }, update: { value } });
  }
  revalidatePath("/", "layout");
  redirect(`${returnTo}?saved=${section}#${section}`);
}

// Pages

export async function savePage(form: FormData) {
  await requireAdmin();
  const original = text(form, "original");
  const slug = slugify(text(form, "slug") ?? text(form, "title") ?? "");
  const isDefault = defaultPages.some((p) => p.slug === (original ?? slug));
  // Default pages keep their address so footer links never break.
  const finalSlug = isDefault ? (original ?? slug) : slug;
  if (!finalSlug || RESERVED_SLUGS.includes(finalSlug)) redirect(`/admin/pages/${original ?? "new"}?error=slug`);
  const taken = finalSlug !== original && (await listPages()).some((p) => p.slug === finalSlug);
  if (taken) redirect(`/admin/pages/${original ?? "new"}?error=taken`);
  const data = {
    title: requiredText(form, "title"),
    description: text(form, "description")?.slice(0, 300) ?? null,
    body: text(form, "body") ?? "",
    published: form.get("published") === "on",
  };
  if (original && original !== finalSlug) await db.page.deleteMany({ where: { slug: original } });
  await db.page.upsert({ where: { slug: finalSlug }, create: { slug: finalSlug, ...data }, update: data });
  revalidatePath("/", "layout");
  redirect(`/admin/pages/${finalSlug}?saved=1`);
}

// Deleting a default page's row restores its default text.
export async function deletePage(form: FormData) {
  await requireAdmin();
  const slug = requiredText(form, "slug");
  await db.page.deleteMany({ where: { slug } });
  revalidatePath("/", "layout");
  const isDefault = defaultPages.some((p) => p.slug === slug);
  redirect(isDefault ? `/admin/pages/${slug}?saved=reset` : "/admin/pages?saved=deleted");
}

// Contact messages

export async function setMessageRead(id: string, read: boolean) {
  await requireAdmin();
  await db.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await db.contactMessage.delete({ where: { id } });
  revalidatePath("/admin", "layout");
}
