import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ReviewForm } from "../../../_components/review-form";
import { reviewOptions } from "../../../_components/review-options";

export default async function EditReview({ params }: PageProps<"/admin/reviews/[id]">) {
  const { id } = await params;
  const [review, options] = await Promise.all([db.review.findUnique({ where: { id } }), reviewOptions()]);
  if (!review) notFound();
  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit review</h1>
      <ReviewForm review={review} {...options} />
    </div>
  );
}
