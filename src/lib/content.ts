import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { site } from "@/content/site";

// Site text = the defaults in src/content/site.ts, with any section edited in
// /admin/homepage stored in SiteSetting and laid over the top.

export type SiteContent = typeof site;
export const EDITABLE_SECTIONS = [
  "promoBar",
  "hero",
  "stats",
  "offers",
  "table",
  "pillars",
  "faq",
  "newsletter",
  "footer",
] as const;
export type EditableSection = (typeof EDITABLE_SECTIONS)[number];

export const getContent = cache(async (): Promise<SiteContent> => {
  let rows: { key: string; value: unknown }[] = [];
  try {
    rows = await db.siteSetting.findMany();
  } catch {
    return site; // database unreachable (for example during a build): use the defaults
  }
  const content: Record<string, unknown> = { ...site };
  for (const row of rows) {
    if (!(EDITABLE_SECTIONS as readonly string[]).includes(row.key)) continue;
    const base = site[row.key as EditableSection];
    content[row.key] = Array.isArray(base)
      ? row.value
      : { ...base, ...(row.value as Record<string, unknown>) };
  }
  return content as SiteContent;
});
