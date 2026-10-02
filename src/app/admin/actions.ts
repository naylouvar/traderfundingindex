"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { createSession, destroySession, passwordMatches, requireAdmin } from "@/lib/auth";
import { decimal, int, oneOf, requiredText, slugify, text } from "@/lib/form";

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
  };
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
  try {
    const firm = await db.firm.update({ where: { id }, data: firmData(form) });
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
  redirect(`/admin/firms/${firmId}?saved=plan#plans`);
}

export async function deletePlan(form: FormData) {
  await requireAdmin();
  const id = requiredText(form, "id");
  const plan = await db.plan.delete({ where: { id }, include: { firm: true } });
  refresh(plan.firm.slug);
  redirect(`/admin/firms/${plan.firmId}?saved=plan#plans`);
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
    text: requiredText(form, "text"),
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

