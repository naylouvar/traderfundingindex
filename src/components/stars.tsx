export function Stars({
  rating,
  count,
  source = "reviews",
}: {
  rating: number | null;
  count: number;
  source?: "reviews" | "editor" | null;
}) {
  if (rating === null) {
    return <span className="whitespace-nowrap text-xs text-muted">No reviews yet</span>;
  }
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap text-xs">
      <span className="rounded bg-accent/15 px-1.5 py-0.5 font-semibold text-accent">{rating.toFixed(1)}</span>
      <span aria-label={`${rating.toFixed(1)} out of 5`} className="tracking-tight text-accent">
        {"★".repeat(Math.round(rating))}
        <span className="text-white/20">{"★".repeat(5 - Math.round(rating))}</span>
      </span>
      <span className="text-muted">{source === "editor" ? "Editor rating" : `${count} ${count === 1 ? "review" : "reviews"}`}</span>
    </span>
  );
}
