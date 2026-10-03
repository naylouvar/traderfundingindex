import { ReviewForm } from "../../../_components/review-form";
import { reviewOptions } from "../../../_components/review-options";

export default async function NewReview() {
  const options = await reviewOptions();
  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">Add a review</h1>
      <ReviewForm {...options} />
    </div>
  );
}
