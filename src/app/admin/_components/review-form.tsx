import type { Review } from "@prisma/client";
import { saveReview } from "../actions";
import { Field, Select, TextArea } from "./fields";

const outcomeOptions = { PAID: "Got paid", PASSED: "Passed", FAILED: "Failed challenge", DENIED: "Payout denied" };
const statusOptions = { APPROVED: "Approved (public)", PENDING: "Pending", REJECTED: "Rejected" };
const scoreOptions = { "5": "5", "4": "4", "3": "3", "2": "2", "1": "1" };

export function ReviewForm({
  review,
  firmOptions,
  planOptions,
}: {
  review?: Review;
  firmOptions: Record<string, string>;
  planOptions: Record<string, string>;
}) {
  const s = (v: number | null | undefined) => (v ? String(v) : null);
  return (
    <form action={saveReview} className="grid gap-4 sm:grid-cols-3">
      {review && <input type="hidden" name="id" value={review.id} />}
      <Select label="Firm" name="firmId" defaultValue={review?.firmId} options={firmOptions} />
      <Select label="Challenge (optional)" name="planId" defaultValue={review?.planId} options={planOptions} allowEmpty />
      <Field label="Author name" name="authorName" defaultValue={review?.authorName} placeholder="Shown on the review" />
      <Field label="Title" name="title" defaultValue={review?.title} className="sm:col-span-2" />
      <Select label="Outcome" name="outcome" defaultValue={review?.outcome ?? "PAID"} options={outcomeOptions} />
      <Select label="Overall (stars)" name="overall" defaultValue={s(review?.overall) ?? "5"} options={scoreOptions} />
      <Select label="Payout reliability" name="payoutReliability" defaultValue={s(review?.payoutReliability)} options={scoreOptions} allowEmpty />
      <Select label="Rule fairness" name="ruleFairness" defaultValue={s(review?.ruleFairness)} options={scoreOptions} allowEmpty />
      <Select label="Support" name="support" defaultValue={s(review?.support)} options={scoreOptions} allowEmpty />
      <Select label="Transparency" name="transparency" defaultValue={s(review?.transparency)} options={scoreOptions} allowEmpty />
      <Select label="Status" name="moderation" defaultValue={review?.moderation ?? "APPROVED"} options={statusOptions} />
      <TextArea label="Review" name="body" defaultValue={review?.body} required className="sm:col-span-3" />
      <label className="flex items-center gap-2 text-sm sm:col-span-3">
        <input type="checkbox" name="verified" defaultChecked={review?.verified} /> Verified (proof of purchase or payout seen)
      </label>
      <div className="sm:col-span-3">
        <button className="btn-primary">{review ? "Save review" : "Add review"}</button>
      </div>
    </form>
  );
}
