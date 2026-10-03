import Link from "next/link";
import { FirmLogo } from "@/components/firm-logo";
import { db } from "@/lib/db";
import { moveFirm, saveFirmOrder } from "../actions";

export default async function AdminHome({ searchParams }: PageProps<"/admin">) {
  const { saved } = await searchParams;
  const firms = await db.firm.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { plans: true, rules: true, countryRules: true, reviews: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Firms</h1>
          <p className="text-sm text-muted">
            The order here is the order on the homepage. Use the arrows, or type positions and save.
          </p>
        </div>
        <Link href="/admin/firms/new" className="btn-primary">
          Add firm
        </Link>
      </div>
      {saved === "order" && (
        <p className="rounded-md bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">Order saved.</p>
      )}
      <form action={saveFirmOrder} className="space-y-4">
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Position</th>
                <th className="px-4 py-3 font-medium">Firm</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Editor rating</th>
                <th className="px-4 py-3 font-medium">Plans</th>
                <th className="px-4 py-3 font-medium">Rules</th>
                <th className="px-4 py-3 font-medium">Countries</th>
                <th className="px-4 py-3 font-medium">Reviews</th>
                <th className="px-4 py-3 font-medium">Offer</th>
                <th className="px-4 py-3 font-medium">Last checked</th>
              </tr>
            </thead>
            <tbody>
              {firms.map((firm, i) => (
                <tr key={firm.id} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <input
                        name={`order_${firm.id}`}
                        type="number"
                        min={1}
                        defaultValue={i + 1}
                        aria-label={`Position of ${firm.name}`}
                        className="input w-16 py-1"
                      />
                      <button
                        formAction={moveFirm.bind(null, firm.id, "up")}
                        disabled={i === 0}
                        aria-label={`Move ${firm.name} up`}
                        className="rounded px-1.5 py-1 text-muted hover:bg-white/10 disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        formAction={moveFirm.bind(null, firm.id, "down")}
                        disabled={i === firms.length - 1}
                        aria-label={`Move ${firm.name} down`}
                        className="rounded px-1.5 py-1 text-muted hover:bg-white/10 disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/firms/${firm.id}`} className="flex items-center gap-2 font-medium hover:text-accent">
                      <FirmLogo name={firm.name} logoUrl={firm.logoUrl} size={28} />
                      {firm.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{firm.status.replace("_", " ").toLowerCase()}</td>
                  <td className="px-4 py-3">{firm.editorRating?.toString() ?? "—"}</td>
                  <td className="px-4 py-3">{firm._count.plans}</td>
                  <td className="px-4 py-3">{firm._count.rules}</td>
                  <td className="px-4 py-3">{firm._count.countryRules}</td>
                  <td className="px-4 py-3">{firm._count.reviews}</td>
                  <td className="px-4 py-3 text-muted">{firm.promoCode ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">
                    {firm.lastVerifiedAt ? firm.lastVerifiedAt.toISOString().slice(0, 10) : "Never"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn-primary">Save order</button>
      </form>
    </div>
  );
}
