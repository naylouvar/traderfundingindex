import type { ReactNode } from "react";
import { getContent, type EditableSection } from "@/lib/content";
import { saveSection } from "../../actions";

const savedLabel: Record<string, string> = {
  promoBar: "Promo bar",
  hero: "Hero",
  stats: "Stat badges",
  offers: "Offers block",
  table: "Rankings block",
  pillars: "Feature cards",
  faq: "FAQ",
  newsletter: "Newsletter block",
  footer: "Footer",
};

function SectionForm({
  section,
  title,
  hint,
  children,
}: {
  section: EditableSection;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section id={section} className="scroll-mt-6 space-y-4 rounded-lg border border-white/10 p-5">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {hint && <p className="text-sm text-muted">{hint}</p>}
      </div>
      <form action={saveSection} className="space-y-4">
        <input type="hidden" name="section" value={section} />
        {children}
        <div className="flex flex-wrap items-center gap-4">
          <button className="btn-primary">Save</button>
          <label className="flex items-center gap-2 text-xs text-muted">
            <input type="checkbox" name="reset" /> Reset this block to the default text
          </label>
        </div>
      </form>
    </section>
  );
}

function Input({ label, name, value, long }: { label: string; name: string; value?: string; long?: boolean }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="text-muted">{label}</span>
      {long ? (
        <textarea name={name} defaultValue={value ?? ""} rows={3} className="input" />
      ) : (
        <input name={name} defaultValue={value ?? ""} className="input" />
      )}
    </label>
  );
}

export default async function HomepageAdmin({ searchParams }: PageProps<"/admin/homepage">) {
  const { saved } = await searchParams;
  const c = await getContent();
  const pillars = [...c.pillars, { title: "", body: "" }, { title: "", body: "" }];
  const faqItems = [...c.faq.items, { q: "", a: "" }, { q: "", a: "" }, { q: "", a: "" }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Homepage text</h1>
        <p className="text-sm text-muted">
          Edit the blocks above and around the rankings table. Changes go live as soon as you save.
        </p>
      </div>
      {typeof saved === "string" && savedLabel[saved] && (
        <p className="rounded-md bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">{savedLabel[saved]} saved.</p>
      )}

      <SectionForm section="promoBar" title="Promo bar" hint="The coloured strip at the very top of every page.">
        <Input label="Text" name="promoBar.text" value={c.promoBar.text} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Button label" name="promoBar.linkLabel" value={c.promoBar.linkLabel} />
          <Input label="Button link" name="promoBar.href" value={c.promoBar.href} />
        </div>
      </SectionForm>

      <SectionForm section="hero" title="Hero" hint="The big headline at the top of the homepage.">
        <Input label="Headline" name="hero.title" value={c.hero.title} />
        <Input label="Subtitle" name="hero.subtitle" value={c.hero.subtitle} long />
      </SectionForm>

      <SectionForm
        section="stats"
        title="Stat badges"
        hint="The numbers are counted automatically. Edit the words after each number, or leave one empty to hide it."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="After the number of firms" name="stats.firms" value={c.stats.firms} />
          <Input label="After the number of reviews" name="stats.reviews" value={c.stats.reviews} />
          <Input label="After the number of payout reports" name="stats.payouts" value={c.stats.payouts} />
          <Input label="After the number of hidden rules" name="stats.rules" value={c.stats.rules} />
        </div>
      </SectionForm>

      <SectionForm section="offers" title="Offers block" hint="The box listing featured discount codes, just above the table.">
        <Input label="Title" name="offers.title" value={c.offers.title} />
        <Input label="Subtitle" name="offers.subtitle" value={c.offers.subtitle} />
        <Input label="Text when there are no offers" name="offers.empty" value={c.offers.empty} />
      </SectionForm>

      <SectionForm section="table" title="Rankings block" hint="The tab names and the link above the table.">
        <div className="grid gap-4 sm:grid-cols-4">
          {["Firms tab", "Challenges tab", "Offers tab", "Reviews tab"].map((label, i) => (
            <Input key={label} label={label} name="table.tabs[]" value={c.table.tabs[i]} />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Link text" name="table.method" value={c.table.method} />
          <Input label="Link target" name="table.methodHref" value={c.table.methodHref} />
        </div>
        <Input label="Table title (for search engines and screen readers)" name="table.title" value={c.table.title} />
      </SectionForm>

      <SectionForm section="pillars" title="Feature cards" hint="The cards under the table. Leave a card empty to remove it.">
        {pillars.map((p, i) => (
          <div key={i} className="grid gap-4 sm:grid-cols-[1fr_2fr]">
            <Input label={`Card ${i + 1} title`} name={`pillars.${i}.title`} value={p.title} />
            <Input label="Text" name={`pillars.${i}.body`} value={p.body} />
          </div>
        ))}
      </SectionForm>

      <SectionForm section="faq" title="FAQ" hint="Leave a question empty to remove it. Save to get more empty rows.">
        <Input label="Section title" name="faq.title" value={c.faq.title} />
        {faqItems.map((item, i) => (
          <div key={i} className="space-y-2 rounded-md border border-white/10 p-3">
            <Input label={`Question ${i + 1}`} name={`faq.items.${i}.q`} value={item.q} />
            <Input label="Answer" name={`faq.items.${i}.a`} value={item.a} long />
          </div>
        ))}
      </SectionForm>

      <SectionForm section="newsletter" title="Newsletter block">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Small heading" name="newsletter.eyebrow" value={c.newsletter.eyebrow} />
          <Input label="Title" name="newsletter.title" value={c.newsletter.title} />
          <Input label="Email placeholder" name="newsletter.placeholder" value={c.newsletter.placeholder} />
          <Input label="Button" name="newsletter.button" value={c.newsletter.button} />
          <Input label="Thank-you message" name="newsletter.thanks" value={c.newsletter.thanks} />
        </div>
      </SectionForm>

      <SectionForm section="footer" title="Footer" hint="Footer links are set in src/content/site.ts.">
        <Input label="Tagline" name="footer.tagline" value={c.footer.tagline} />
        <Input label="Disclaimer" name="footer.disclaimer" value={c.footer.disclaimer} long />
      </SectionForm>
    </div>
  );
}
