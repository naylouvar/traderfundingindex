import Link from "next/link";
import { getContent } from "@/lib/content";
import { Field as Input, SavedNote, SectionForm as Section } from "../../_components/section-form";

const RETURN = "/admin/homepage";

function SectionForm(props: Omit<Parameters<typeof Section>[0], "returnTo">) {
  return <Section {...props} returnTo={RETURN} />;
}

const savedLabel: Record<string, string> = {
  hero: "Hero",
  stats: "Stat badges",
  offers: "Offers block",
  table: "Rankings block",
  pillars: "Feature cards",
  faq: "FAQ",
  newsletter: "Newsletter block",
};

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
          Edit the blocks above and around the rankings table. Changes go live as soon as you save. The promo bar,
          menu and footer are under{" "}
          <Link href="/admin/site" className="underline">
            Header &amp; footer
          </Link>
          .
        </p>
      </div>
      <SavedNote saved={saved} labels={savedLabel} />


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

    </div>
  );
}
