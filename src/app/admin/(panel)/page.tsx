import Link from "next/link";
import { db } from "@/lib/db";

export default async function AdminHome() {
  const firms = await db.firm.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { plans: true, rules: true, countryRules: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Firms</h1>
        <Link href="/admin/firms/new" className="btn-primary">
          Add firm
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Firm</th>
              <th className="px-4 py-3 font-medium">Plans</th>
              <th className="px-4 py-3 font-medium">Rules</th>
              <th className="px-4 py-3 font-medium">Countries</th>
              <th className="px-4 py-3 font-medium">Last checked</th>
            </tr>
          </thead>
          <tbody>
            {firms.map((firm) => (
              <tr key={firm.id} className="border-t border-white/10">
                <td className="px-4 py-3">
                  <Link href={`/admin/firms/${firm.id}`} className="font-medium hover:text-accent">
                    {firm.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{firm._count.plans}</td>
                <td className="px-4 py-3">{firm._count.rules}</td>
                <td className="px-4 py-3">{firm._count.countryRules}</td>
                <td className="px-4 py-3 text-muted">
                  {firm.lastVerifiedAt ? firm.lastVerifiedAt.toISOString().slice(0, 10) : "Never"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
