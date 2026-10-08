import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { listPages } from "@/lib/pages";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.SITE_URL ?? "https://traderfundingindex.com").replace(/\/$/, "");
  const firms = await db.firm.findMany({ select: { slug: true, updatedAt: true } }).catch(() => []);
  const pages = (await listPages()).filter((p) => p.published);
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/firms`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/fine-print`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/payout-rules`, changeFrequency: "weekly", priority: 0.8 },
    ...firms.map((f) => ({ url: `${base}/firms/${f.slug}`, lastModified: f.updatedAt, priority: 0.8 })),
    ...pages.map((p) => ({ url: `${base}/${p.slug}`, lastModified: p.updatedAt ?? undefined, priority: 0.4 })),
  ];
}
