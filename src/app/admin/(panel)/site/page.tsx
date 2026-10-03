import { FirmLogo } from "@/components/firm-logo";
import { getContent } from "@/lib/content";
import { Field, SavedNote, SectionForm } from "../../_components/section-form";

const RETURN = "/admin/site";
const savedLabel: Record<string, string> = {
  brand: "Logo and name",
  promoBar: "Promo bar",
  nav: "Menu",
  footer: "Footer",
};

const SOCIAL = [
  ["x", "X (Twitter)"],
  ["discord", "Discord"],
  ["youtube", "YouTube"],
  ["telegram", "Telegram"],
  ["instagram", "Instagram"],
] as const;

export default async function SiteAdmin({ searchParams }: PageProps<"/admin/site">) {
  const { saved, error } = await searchParams;
  const c = await getContent();
  const nav = [...c.nav, ...Array.from({ length: 3 }, () => ({ label: "", href: "", note: "" }))];
  const columns = [...c.footer.columns, { title: "", links: [] }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Header &amp; footer</h1>
        <p className="text-sm text-muted">The logo, menu and footer shown on every page.</p>
      </div>
      <SavedNote saved={saved} labels={savedLabel} />
      {error === "logo" && (
        <p className="rounded-md bg-red-500/10 px-4 py-2 text-sm text-red-300">
          The logo must be a PNG, JPG, WebP or GIF image of 2 MB or less.
        </p>
      )}

      <SectionForm section="brand" title="Logo and name" hint="Without a logo image, the name is shown with one word in the accent colour." returnTo={RETURN}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Site name" name="brand.name" value={c.brand.name} />
          <Field label="Highlighted word (part of the name)" name="brand.accent" value={c.brand.accent} />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {c.brand.logoUrl && <FirmLogo name={c.brand.name} logoUrl={c.brand.logoUrl} size={48} />}
          <label className="block space-y-1 text-sm">
            <span className="text-muted">Logo image (PNG, JPG, WebP or GIF, max 2 MB)</span>
            <input type="file" name="brand.logoFile" accept="image/png,image/jpeg,image/webp,image/gif" className="block text-sm" />
          </label>
          {c.brand.logoUrl && (
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="brand.removeLogo" /> Remove logo
            </label>
          )}
        </div>
      </SectionForm>

      <SectionForm section="promoBar" title="Promo bar" hint="The coloured strip at the very top. Leave the text empty to hide it." returnTo={RETURN}>
        <Field label="Text" name="promoBar.text" value={c.promoBar.text} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Button label" name="promoBar.linkLabel" value={c.promoBar.linkLabel} />
          <Field label="Button link" name="promoBar.href" value={c.promoBar.href} />
        </div>
      </SectionForm>

      <SectionForm
        section="nav"
        title="Menu"
        hint="Links in the header. Leave the link empty to show the item greyed out (for pages that are coming soon). Leave the label empty to remove a row."
        returnTo={RETURN}
      >
        <div className="space-y-2">
          <div className="hidden grid-cols-[1fr_1.5fr_0.7fr] gap-3 text-xs text-muted sm:grid">
            <span>Label</span>
            <span>Link (for example /firms or /about)</span>
            <span>Badge (optional, e.g. Soon or New)</span>
          </div>
          {nav.map((item, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[1fr_1.5fr_0.7fr]">
              <input name={`nav.${i}.label`} defaultValue={item.label} aria-label={`Menu item ${i + 1} label`} className="input" />
              <input name={`nav.${i}.href`} defaultValue={item.href ?? ""} aria-label={`Menu item ${i + 1} link`} className="input" />
              <input name={`nav.${i}.note`} defaultValue={item.note ?? ""} aria-label={`Menu item ${i + 1} badge`} className="input" />
            </div>
          ))}
        </div>
      </SectionForm>

      <SectionForm section="footer" title="Footer" returnTo={RETURN}>
        <Field label="Tagline (under the logo)" name="footer.tagline" value={c.footer.tagline} long rows={2} />
        <Field label="Disclaimer (bottom line)" name="footer.disclaimer" value={c.footer.disclaimer} long />
        <div className="space-y-2">
          <p className="text-sm font-medium">Social links</p>
          <p className="text-xs text-muted">Full URLs starting with https://. Empty ones are hidden.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SOCIAL.map(([key, label]) => (
              <Field key={key} label={label} name={`footer.${key}`} value={c.footer[key]} placeholder="https://" />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Link columns</p>
          <p className="text-xs text-muted">
            One link per line, written as <code className="text-foreground">Label | /link</code>. A line without a link is shown greyed
            out. Leave a column title empty to remove it.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {columns.map((col, i) => (
              <div key={i} className="space-y-2 rounded-md border border-white/10 p-3">
                <Field label={`Column ${i + 1} title`} name={`footer.columns.${i}.title`} value={col.title} />
                <Field
                  label="Links"
                  name={`footer.columns.${i}.links`}
                  value={col.links.map((l) => (l.href ? `${l.label} | ${l.href}` : l.label)).join("\n")}
                  long
                  rows={5}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionForm>
    </div>
  );
}
