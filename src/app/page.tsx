import Link from "next/link";

const pillars = [
  {
    title: "Firm index",
    body: "Every futures prop firm side by side: fees, trailing drawdown, contract limits, profit split and payout terms.",
  },
  {
    title: "Hidden rules",
    body: "The consistency rules, news bans and country restrictions buried in the fine print, each with its source.",
  },
  {
    title: "Real payouts",
    body: "What traders actually got paid, how long it took, and which payouts were denied, backed by proof.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="space-y-6 pt-6">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          The futures prop firm index that shows the dark side too.
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          Real profit splits, hidden rules and banned countries, reported by
          traders who bought the challenges.
        </p>
        <Link
          href="/firms"
          className="inline-block rounded-md bg-accent px-5 py-2.5 font-medium text-black hover:opacity-90"
        >
          Compare firms
        </Link>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {pillars.map((p) => (
          <div key={p.title} className="rounded-lg border border-white/10 p-5">
            <h2 className="font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm text-muted">{p.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
