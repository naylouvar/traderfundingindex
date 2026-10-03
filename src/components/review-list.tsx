import Link from "next/link";
import type { getApprovedReviews } from "@/lib/firms";
import { FirmLogo } from "./firm-logo";

type Review = Awaited<ReturnType<typeof getApprovedReviews>>[number];

const outcomeLabel = { FAILED: "Failed challenge", PASSED: "Passed", PAID: "Got paid", DENIED: "Payout denied" };

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="rounded-xl border border-white/10 p-8 text-center text-muted">No reviews yet.</p>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {reviews.map((r) => (
        <article key={r.id} className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between gap-3">
            <Link href={`/firms/${r.firm.slug}`} className="flex items-center gap-2 font-semibold hover:text-accent">
              <FirmLogo name={r.firm.name} logoUrl={r.firm.logoUrl} size={28} />
              {r.firm.name}
            </Link>
            <span className="text-sm text-accent">
              {"★".repeat(r.overall)}
              <span className="text-white/20">{"★".repeat(5 - r.overall)}</span>
            </span>
          </div>
          {r.title && <h3 className="font-medium">{r.title}</h3>}
          <p className="line-clamp-4 text-sm text-muted">{r.body}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className={r.outcome === "DENIED" ? "text-red-300" : r.outcome === "PAID" ? "text-emerald-300" : ""}>
              {outcomeLabel[r.outcome]}
            </span>
            <span>·</span>
            <span>{r.user?.handle ?? r.authorName ?? "Anonymous"}</span>
            {r.verified && <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-emerald-300">Verified</span>}
            <span>· {r.createdAt.toISOString().slice(0, 10)}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
