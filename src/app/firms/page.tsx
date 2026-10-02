import type { Metadata } from "next";
import { FirmTable } from "@/components/firm-table";
import { getRankedFirms } from "@/lib/firms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Compare futures prop firms" };

export default async function FirmsPage({ searchParams }: PageProps<"/firms">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim().slice(0, 100) : "";
  const firms = await getRankedFirms(query ? { name: { contains: query } } : {});

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Futures prop firms</h1>
      <form className="flex max-w-md gap-2">
        <input name="q" type="search" defaultValue={query} placeholder="Search firms" aria-label="Search firms" className="input" />
        <button className="btn-secondary">Search</button>
      </form>
      {query && (
        <p className="text-sm text-muted">
          {firms.length} result{firms.length === 1 ? "" : "s"} for “{query}”
        </p>
      )}
      <FirmTable firms={firms} />
    </div>
  );
}
