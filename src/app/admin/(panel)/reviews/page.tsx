import Link from "next/link";
import type { ModerationStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { deleteReview, setReviewStatus } from "../../actions";

const FILTERS: Record<string, string> = { "": "All", PENDING: "Pending", APPROVED: "Approved", REJECTED: "Rejected" };

export default async function ReviewsAdmin({ searchParams }: PageProps<"/admin/reviews">) {
  const { saved, status } = await searchParams;
  const filter = typeof status === "string" && status in FILTERS ? status : "";
  const reviews = await db.review.findMany({
    where: filter ? { moderation: filter as ModerationStatus } : {},
    include: { firm: { select: { name: true } }, user: { select: { handle: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Reviews</h1>
          <p className="text-sm text-muted">Approved reviews show on the homepage Reviews tab and count towards ratings.</p>
        </div>
        <Link href="/admin/reviews/new" className="btn-primary">
          Add review
        </Link>
      </div>
      {saved && <p className="rounded-md bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">Reviews updated.</p>}
      <div className="flex gap-2 text-sm">
        {Object.entries(FILTERS).map(([value, label]) => (
          <Link
            key={value}
            href={value ? `/admin/reviews?status=${value}` : "/admin/reviews"}
            className={value === filter ? "rounded-md bg-accent px-3 py-1 font-semibold text-black" : "rounded-md px-3 py-1 text-muted hover:text-foreground"}
          >
            {label}
          </Link>
        ))}
      </div>
      {reviews.length === 0 && <p className="text-muted">No reviews here.</p>}
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="space-y-2 rounded-lg border border-white/10 p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium">
                {r.firm.name} · <span className="text-accent">{"★".repeat(r.overall)}</span>{" "}
                <span className="text-muted">
                  by {r.user?.handle ?? r.authorName ?? "Anonymous"} · {r.createdAt.toISOString().slice(0, 10)}
                </span>
              </div>
              <span
                className={
                  r.moderation === "APPROVED"
                    ? "rounded bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300"
                    : r.moderation === "REJECTED"
                      ? "rounded bg-red-500/15 px-2 py-0.5 text-xs text-red-300"
                      : "rounded bg-white/10 px-2 py-0.5 text-xs text-muted"
                }
              >
                {r.moderation.toLowerCase()}
              </span>
            </div>
            {r.title && <p className="font-medium">{r.title}</p>}
            <p className="line-clamp-3 text-muted">{r.body}</p>
            <div className="flex flex-wrap gap-2">
              <Link href={`/admin/reviews/${r.id}`} className="btn-secondary py-1 text-xs">
                Edit
              </Link>
              {(["APPROVED", "PENDING", "REJECTED"] as const)
                .filter((m) => m !== r.moderation)
                .map((m) => (
                  <form key={m} action={setReviewStatus}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="filter" value={filter} />
                    <button name="moderation" value={m} className="btn-secondary py-1 text-xs">
                      {m === "APPROVED" ? "Approve" : m === "REJECTED" ? "Reject" : "Mark pending"}
                    </button>
                  </form>
                ))}
              <form action={deleteReview}>
                <input type="hidden" name="id" value={r.id} />
                <button className="btn-danger py-1 text-xs">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
