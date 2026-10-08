import Link from "next/link";
import { notFound } from "next/navigation";
import type { Rule } from "@prisma/client";
import { PlanForm } from "../../../_components/plan-form";
import { FirmLogo } from "@/components/firm-logo";
import { db } from "@/lib/db";
import { usd } from "@/lib/format";
import { payoutRuleFields, payoutRulesLegend } from "@/lib/payout-rules";
import {
  deleteCountryRule,
  deleteFirm,
  deletePayoutRules,
  deletePlan,
  deleteRule,
  markVerified,
  saveCountryRule,
  savePayoutRules,
  saveRule,
  updateFirm,
} from "../../../actions";
import {
  Field,
  Section,
  Select,
  TextArea,
  assetClassOptions,
  countryStatusOptions,
  firmStatusOptions,
  ruleCategoryOptions,
  severityOptions,
} from "../../../_components/fields";

const savedMessages: Record<string, string> = {
  firm: "Firm details saved.",
  verified: "Marked as checked today.",
  plan: "Plans updated.",
  rule: "Rules updated.",
  payout: "Payout rules updated.",
  country: "Countries updated.",
};

const errorMessages: Record<string, string> = {
  slug: "Another firm already uses that URL slug.",
  confirm: 'Type "delete" to confirm deleting the firm.',
  country: "Use a two-letter country code, like US or FR.",
  logo: "Logo must be a PNG, JPG, WebP or GIF image of 2 MB or less.",
};

export default async function EditFirmPage({ params, searchParams }: PageProps<"/admin/firms/[id]">) {
  const { id } = await params;
  const { saved, error } = await searchParams;
  const firm = await db.firm.findUnique({
    where: { id },
    include: {
      plans: { orderBy: { accountSizeUsd: "asc" } },
      rules: { orderBy: [{ severity: "desc" }, { createdAt: "asc" }] },
      countryRules: { orderBy: { countryCode: "asc" } },
      payoutRules: true,
    },
  });
  if (!firm) notFound();

  const savedText = typeof saved === "string" ? savedMessages[saved] : undefined;
  const errorText = typeof error === "string" ? errorMessages[error] : undefined;
  const planOptions = Object.fromEntries(
    firm.plans.map((p) => [p.id, `${p.name} (${usd(p.accountSizeUsd)})`]),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{firm.name}</h1>
          <p className="text-sm text-muted">
            Last checked: {firm.lastVerifiedAt ? firm.lastVerifiedAt.toISOString().slice(0, 10) : "never"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/firms/${firm.slug}`} className="btn-secondary">
            View public page
          </Link>
          <form action={markVerified}>
            <input type="hidden" name="id" value={firm.id} />
            <button className="btn-secondary">Mark checked today</button>
          </form>
        </div>
      </div>

      {savedText && <p className="rounded-md bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">{savedText}</p>}
      {errorText && <p className="rounded-md bg-red-500/10 px-4 py-2 text-sm text-red-300">{errorText}</p>}

      <Section id="details" title="Firm details">
        <form action={updateFirm} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={firm.id} />
          <Field label="Name" name="name" defaultValue={firm.name} required />
          <Field label="URL slug" name="slug" defaultValue={firm.slug} required />
          <Field label="Website" name="website" type="url" defaultValue={firm.website} />
          <Field label="Platforms" name="platforms" defaultValue={firm.platforms} placeholder="Tradovate, Rithmic, NinjaTrader" />
          <Field label="Founded (year)" name="foundedYear" type="number" defaultValue={firm.foundedYear} />
          <Field label="HQ country (2 letters)" name="hqCountry" defaultValue={firm.hqCountry} placeholder="US" />
          <Select label="Status" name="status" defaultValue={firm.status} options={firmStatusOptions} />
          <Select label="Asset class" name="assetClass" defaultValue={firm.assetClass} options={assetClassOptions} />
          <div className="space-y-2 text-sm sm:col-span-2">
            <span className="text-muted">Logo</span>
            <div className="flex flex-wrap items-center gap-4">
              <FirmLogo name={firm.name} logoUrl={firm.logoUrl} size={56} />
              <input type="file" name="logoFile" accept="image/png,image/jpeg,image/webp,image/gif" className="text-sm" />
              {firm.logoUrl && (
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="removeLogo" /> Remove logo
                </label>
              )}
            </div>
            <p className="text-xs text-muted">PNG, JPG, WebP or GIF, up to 2 MB. Square images look best.</p>
            <input type="hidden" name="logoUrl" value={firm.logoUrl ?? ""} />
          </div>
          <Field label="Position on the homepage" name="sortOrder" type="number" defaultValue={firm.sortOrder} />
          <Field
            label="Editor rating (0 to 5, shown until reviews exist)"
            name="editorRating"
            defaultValue={firm.editorRating?.toString()}
            placeholder="4.5"
          />
          <TextArea label="Description" name="description" defaultValue={firm.description} className="sm:col-span-2" />
          <h3 className="pt-2 font-medium sm:col-span-2">Offer</h3>
          <Field label="Discount code" name="promoCode" defaultValue={firm.promoCode} />
          <Field label="Discount (%)" name="promoDiscountPct" type="number" defaultValue={firm.promoDiscountPct} />
          <Field label="Offer link (shown as a partner link)" name="promoUrl" type="url" defaultValue={firm.promoUrl} />
          <Field label="Offer ends on" name="promoEndsAt" type="date" defaultValue={firm.promoEndsAt?.toISOString().slice(0, 10)} />
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" name="featured" defaultChecked={firm.featured} />
            Show this offer in the homepage offers strip
          </label>
          <div className="sm:col-span-2">
            <button className="btn-primary">Save details</button>
          </div>
        </form>
      </Section>

      <Section id="plans" title={`Plans (${firm.plans.length})`}>
        <p className="text-sm text-muted">
          Edits to an existing plan are saved to the change log, so traders can see when terms changed.
        </p>
        {firm.plans.map((plan) => (
          <details key={plan.id} className="rounded-md border border-white/10 p-4">
            <summary className="cursor-pointer font-medium">
              {plan.name} · {usd(plan.accountSizeUsd)} · {usd(plan.priceUsd)}
            </summary>
            <div className="mt-4 space-y-3">
              <PlanForm firmId={firm.id} plan={plan} />
              <form action={deletePlan}>
                <input type="hidden" name="id" value={plan.id} />
                <button className="btn-danger">Delete plan</button>
              </form>
            </div>
          </details>
        ))}
        <details className="rounded-md border border-dashed border-white/20 p-4" open={firm.plans.length === 0}>
          <summary className="cursor-pointer font-medium text-accent">Add a plan</summary>
          <div className="mt-4">
            <PlanForm firmId={firm.id} />
          </div>
        </details>
      </Section>

      <Section id="payout-rules" title="Funded account and payout rules">
        <p className="text-sm text-muted">
          Shown on the firm page and the payout rules comparison. Write each rule plan by plan. {payoutRulesLegend}
        </p>
        <form action={savePayoutRules} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="firmId" value={firm.id} />
          {payoutRuleFields.map((f) => (
            <TextArea
              key={f.key}
              label={f.hint ? `${f.label} (${f.hint})` : f.label}
              name={f.key}
              defaultValue={firm.payoutRules?.[f.key]}
              rows={f.key === "plansCovered" || f.key === "accountSizes" ? 2 : 4}
            />
          ))}
          <Field
            label="Restricted countries (count)"
            name="restrictedCountryCount"
            type="number"
            defaultValue={firm.payoutRules?.restrictedCountryCount}
          />
          <Field
            label="Checked on"
            name="checkedOn"
            type="date"
            defaultValue={firm.payoutRules?.checkedOn?.toISOString().slice(0, 10)}
          />
          <TextArea
            label="Restricted countries (comma-separated names)"
            name="restrictedCountries"
            defaultValue={firm.payoutRules?.restrictedCountries}
            rows={4}
            className="sm:col-span-2"
          />
          <TextArea
            label="Sources and conflicts (shown as a warning on the firm page)"
            name="notes"
            defaultValue={firm.payoutRules?.notes}
            className="sm:col-span-2"
          />
          <Field
            label="Source URL"
            name="sourceUrl"
            type="url"
            defaultValue={firm.payoutRules?.sourceUrl}
            className="sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <button className="btn-primary">Save payout rules</button>
          </div>
        </form>
        {firm.payoutRules && (
          <form action={deletePayoutRules}>
            <input type="hidden" name="firmId" value={firm.id} />
            <button className="btn-danger">Remove payout rules</button>
          </form>
        )}
      </Section>

      <Section id="rules" title={`Rules and fine print (${firm.rules.length})`}>
        <p className="text-sm text-muted">
          Tick &quot;Fine print&quot; for rules buried in help articles or terms. They get their own section at the top of
          the firm page, with your &quot;what it really means&quot; breakdown under the firm&apos;s wording.
        </p>
        {firm.rules.map((rule) => (
          <div key={rule.id} className="space-y-3 rounded-md border border-white/10 p-4">
            <RuleForm firmId={firm.id} rule={rule} planOptions={planOptions} />
            <form action={deleteRule}>
              <input type="hidden" name="id" value={rule.id} />
              <button className="btn-danger">Delete rule</button>
            </form>
          </div>
        ))}
        <div className="rounded-md border border-dashed border-white/20 p-4">
          <h3 className="mb-3 font-medium text-accent">Add a rule</h3>
          <RuleForm firmId={firm.id} planOptions={planOptions} />
        </div>
      </Section>

      <Section id="countries" title={`Country restrictions (${firm.countryRules.length})`}>
        {firm.countryRules.length > 0 && (
          <ul className="divide-y divide-white/10 text-sm">
            {firm.countryRules.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 py-2">
                <span>
                  <strong>{c.countryCode}</strong> · {countryStatusOptions[c.status]}
                  {c.note && <span className="text-muted"> · {c.note}</span>}
                </span>
                <form action={deleteCountryRule}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="text-xs text-red-300 hover:underline">Remove</button>
                </form>
              </li>
            ))}
          </ul>
        )}
        <form action={saveCountryRule} className="grid gap-3 sm:grid-cols-5 sm:items-end">
          <input type="hidden" name="firmId" value={firm.id} />
          <Field label="Country code" name="countryCode" placeholder="US" required />
          <Select label="Status" name="status" defaultValue="BANNED" options={countryStatusOptions} />
          <Field label="Note" name="note" />
          <Field label="Source URL" name="sourceUrl" type="url" />
          <button className="btn-primary">Add / update</button>
        </form>
      </Section>

      <Section id="danger" title="Delete firm">
        <p className="text-sm text-muted">
          This removes the firm with its plans, rules, countries, reviews and payout reports. It cannot be undone.
        </p>
        <form action={deleteFirm} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="id" value={firm.id} />
          <Field label='Type "delete" to confirm' name="confirm" />
          <button className="btn-danger">Delete firm</button>
        </form>
      </Section>
    </div>
  );
}

function RuleForm({
  firmId,
  rule,
  planOptions,
}: {
  firmId: string;
  rule?: Rule;
  planOptions: Record<string, string>;
}) {
  return (
    <form action={saveRule} className="grid gap-4 sm:grid-cols-3">
      <input type="hidden" name="firmId" value={firmId} />
      {rule && <input type="hidden" name="id" value={rule.id} />}
      <Select label="Category" name="category" defaultValue={rule?.category ?? "OTHER"} options={ruleCategoryOptions} />
      <Select label="Severity" name="severity" defaultValue={rule?.severity ?? "MEDIUM"} options={severityOptions} />
      <Select label="Applies to plan" name="planId" defaultValue={rule?.planId} options={planOptions} allowEmpty />
      <Field
        label="Headline (shown in bold on the firm page)"
        name="title"
        defaultValue={rule?.title}
        placeholder="The $150K buffer is bigger than the max payout"
        className="sm:col-span-3"
      />
      <TextArea
        label="What the terms say"
        name="text"
        defaultValue={rule?.text}
        required
        className="sm:col-span-3"
      />
      <TextArea
        label="What it really means for traders (optional, Markdown: **bold**, - lists)"
        name="impact"
        defaultValue={rule?.impact}
        rows={6}
        className="sm:col-span-3"
      />
      <Field label="Source URL" name="sourceUrl" type="url" defaultValue={rule?.sourceUrl} className="sm:col-span-2" />
      <label className="flex items-center gap-2 self-end pb-2 text-sm">
        <input type="checkbox" name="hidden" defaultChecked={rule?.hidden} />
        Fine print (buried in the terms, shown first)
      </label>
      <div className="sm:col-span-3">
        <button className="btn-primary">{rule ? "Save rule" : "Add rule"}</button>
      </div>
    </form>
  );
}
