import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { defaultPages, type PageDefault } from "@/content/pages";

export type SitePage = PageDefault & { published: boolean; isDefault: boolean; edited: boolean; updatedAt: Date | null };

async function rows() {
  try {
    return await db.page.findMany();
  } catch {
    return []; // database unreachable (for example during a build): use the defaults
  }
}

// Every page: the defaults (with any edits applied) followed by custom pages.
export const listPages = cache(async (): Promise<SitePage[]> => {
  const saved = new Map((await rows()).map((row) => [row.slug, row]));
  const pages: SitePage[] = defaultPages.map((page) => {
    const row = saved.get(page.slug);
    saved.delete(page.slug);
    return row
      ? { ...row, description: row.description ?? "", isDefault: true, edited: true }
      : { ...page, published: true, isDefault: true, edited: false, updatedAt: null };
  });
  for (const row of saved.values()) {
    pages.push({ ...row, description: row.description ?? "", isDefault: false, edited: true });
  }
  return pages;
});

export async function getPage(slug: string) {
  return (await listPages()).find((page) => page.slug === slug) ?? null;
}
