import type { Metadata } from "next";
import Link from "next/link";
import { FinePrintCard } from "@/components/fine-print-card";
import { FirmLogo } from "@/components/firm-logo";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Hidden rules and fine print at futures prop firms" };

export default async function FinePrintPage() {
  const firms = await db.firm.findMany({
    where: { rules: { some: { hidden: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      rules: { where: { hidden: true }, orderBy: [{ severity: "desc" }, { createdAt: "asc" }] },
    },
  });

  return (
    <div className="space-y-10">
      <header className="max-w-3xl space-y-2">
        <h1 className="text-3xl font-semibold">The fine print</h1>
        <p className="text-muted">
          Rules buried in help articles and terms of service that change what you actually get paid. Each one quotes
          the firm&apos;s own wording, then breaks down what it means for your account.
        </p>
      </header>

      {firms.length === 0 ? (
        <p className="text-muted">No findings published yet.</p>
      ) : (
        firms.map((firm) => (
          <section key={firm.id} className="space-y-4">
            <h2 className="flex items-center gap-3 text-xl font-semibold">
              <FirmLogo name={firm.name} logoUrl={firm.logoUrl} size={32} />
              <Link href={`/firms/${firm.slug}#fine-print`} className="hover:text-accent">
                {firm.name}
              </Link>
            </h2>
            {firm.rules.map((r) => (
              <FinePrintCard key={r.id} rule={r} />
            ))}
          </section>
        ))
      )}
    </div>
  );
}
