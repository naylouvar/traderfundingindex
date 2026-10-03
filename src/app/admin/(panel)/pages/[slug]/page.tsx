import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/pages";
import { deletePage, savePage } from "../../../actions";

const ERRORS: Record<string, string> = {
  slug: "That address is not allowed. Use letters, numbers and dashes, and avoid admin, firms and uploads.",
  taken: "Another page already uses that address.",
};

export default async function EditPage({ params, searchParams }: PageProps<"/admin/pages/[slug]">) {
  const { slug } = await params;
  const { saved, error } = await searchParams;
  const isNew = slug === "new";
  const page = isNew ? null : await getPage(slug);
  if (!isNew && !page) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin/pages" className="text-sm text-muted hover:text-foreground">
            ← All pages
          </Link>
          <h1 className="mt-1 text-2xl font-semibold">{isNew ? "Add page" : page!.title}</h1>
        </div>
        {page && (
          <Link href={`/${page.slug}`} target="_blank" className="btn-secondary">
            View page
          </Link>
        )}
      </div>
      {saved === "1" && <p className="rounded-md bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">Page saved.</p>}
      {saved === "reset" && <p className="rounded-md bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">Default text restored.</p>}
      {typeof error === "string" && ERRORS[error] && (
        <p className="rounded-md bg-red-500/10 px-4 py-2 text-sm text-red-300">{ERRORS[error]}</p>
      )}

      <form action={savePage} className="space-y-4 rounded-lg border border-white/10 p-5">
        {page && <input type="hidden" name="original" value={page.slug} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm">
            <span className="text-muted">Title</span>
            <input name="title" required defaultValue={page?.title} className="input" />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-muted">Address</span>
            <div className="flex items-center gap-1">
              <span className="text-muted">/</span>
              <input
                name="slug"
                defaultValue={page?.slug}
                readOnly={page?.isDefault}
                placeholder="made from the title if empty"
                className="input read-only:opacity-60"
              />
            </div>
            {page?.isDefault && <span className="text-xs text-muted">Built-in pages keep their address so links never break.</span>}
          </label>
        </div>
        <label className="block space-y-1 text-sm">
          <span className="text-muted">Short description (shown under the title and in search results)</span>
          <input name="description" maxLength={300} defaultValue={page?.description} className="input" />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-muted">Text</span>
          <textarea name="body" rows={22} defaultValue={page?.body} className="input font-mono text-[13px] leading-6" />
        </label>
        <details className="rounded-md border border-white/10 p-3 text-sm text-muted">
          <summary className="cursor-pointer">Formatting help</summary>
          <ul className="mt-2 space-y-1 font-mono text-xs">
            <li>## Heading &nbsp; ### Smaller heading</li>
            <li>- List item &nbsp; 1. Numbered item</li>
            <li>**bold** &nbsp; *italic* &nbsp; [link text](/firms) &nbsp; [email](mailto:you@example.com)</li>
            <li>Leave an empty line between paragraphs.</li>
          </ul>
          {page?.slug === "contact" && <p className="mt-2">The contact form is added under this text automatically.</p>}
        </details>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={page?.published ?? true} /> Published (visible on the site)
        </label>
        <button className="btn-primary">{isNew ? "Create page" : "Save page"}</button>
      </form>

      {page && (page.isDefault ? page.edited : true) && (
        <form action={deletePage} className="flex items-center gap-3">
          <input type="hidden" name="slug" value={page.slug} />
          <button className="btn-danger">{page.isDefault ? "Restore default text" : "Delete page"}</button>
          <span className="text-xs text-muted">
            {page.isDefault ? "Replaces your edits with the original text." : "The page will be removed from the site."}
          </span>
        </form>
      )}
    </div>
  );
}
