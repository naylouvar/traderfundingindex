import { FirmLogo } from "@/components/firm-logo";
import { db } from "@/lib/db";
import { saveOffer } from "../../actions";

export default async function OffersAdmin({ searchParams }: PageProps<"/admin/offers">) {
  const { saved } = await searchParams;
  const firms = await db.firm.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Offers</h1>
        <p className="text-sm text-muted">
          A firm shows in the Offers tab when it has a discount code that hasn&apos;t ended. Tick
          &quot;Featured&quot; to also show it in the offers strip above the table.
        </p>
      </div>
      {saved && <p className="rounded-md bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">Offer saved.</p>}
      <div className="space-y-3">
        {firms.map((firm) => (
          <form
            key={firm.id}
            action={saveOffer}
            className="grid items-end gap-3 rounded-lg border border-white/10 p-4 md:grid-cols-[180px_1fr_100px_1.5fr_150px_auto_auto]"
          >
            <input type="hidden" name="id" value={firm.id} />
            <div className="flex items-center gap-2 self-center font-medium">
              <FirmLogo name={firm.name} logoUrl={firm.logoUrl} size={28} />
              {firm.name}
            </div>
            <label className="space-y-1 text-sm">
              <span className="text-muted">Code</span>
              <input name="promoCode" defaultValue={firm.promoCode ?? ""} className="input" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted">% off</span>
              <input name="promoDiscountPct" type="number" min={0} max={100} defaultValue={firm.promoDiscountPct ?? ""} className="input" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted">Partner link</span>
              <input name="promoUrl" type="url" defaultValue={firm.promoUrl ?? ""} className="input" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted">Ends on</span>
              <input name="promoEndsAt" type="date" defaultValue={firm.promoEndsAt?.toISOString().slice(0, 10) ?? ""} className="input" />
            </label>
            <label className="flex items-center gap-2 pb-2 text-sm">
              <input type="checkbox" name="featured" defaultChecked={firm.featured} /> Featured
            </label>
            <button className="btn-primary">Save</button>
          </form>
        ))}
      </div>
    </div>
  );
}
