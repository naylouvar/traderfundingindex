import Link from "next/link";
import { listPages } from "@/lib/pages";

export default async function PagesAdmin({ searchParams }: PageProps<"/admin/pages">) {
  const { saved } = await searchParams;
  const pages = await listPages();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Pages</h1>
          <p className="text-sm text-muted">About, contact and legal pages. Link to them from the menu or footer under Header &amp; footer.</p>
        </div>
        <Link href="/admin/pages/new" className="btn-primary">
          Add page
        </Link>
      </div>
      {saved === "deleted" && <p className="rounded-md bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">Page deleted.</p>}
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Page</th>
              <th className="px-4 py-3 font-medium">Address</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last edited</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {pages.map((page) => (
              <tr key={page.slug} className="hover:bg-white/[0.03]">
                <td className="px-4 py-3">
                  <Link href={`/admin/pages/${page.slug}`} className="font-medium hover:text-accent">
                    {page.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/${page.slug}`} className="text-muted hover:text-foreground" target="_blank">
                    /{page.slug}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {page.published ? <span className="text-emerald-300">Published</span> : <span className="text-muted">Hidden</span>}
                </td>
                <td className="px-4 py-3 text-muted">
                  {page.updatedAt ? page.updatedAt.toLocaleDateString("en-US", { dateStyle: "medium" }) : "Default text"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
