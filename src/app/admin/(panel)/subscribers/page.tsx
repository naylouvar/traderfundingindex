import { db } from "@/lib/db";

export default async function SubscribersAdmin() {
  const subscribers = await db.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Newsletter subscribers ({subscribers.length})</h1>
        <p className="text-sm text-muted">Select the list below and copy it into your email tool.</p>
      </div>
      <textarea
        readOnly
        rows={Math.min(Math.max(subscribers.length, 4), 20)}
        value={subscribers.map((s) => s.email).join("\n")}
        aria-label="Subscriber emails"
        className="input font-mono"
      />
      <table className="w-full text-left text-sm">
        <thead className="text-muted">
          <tr>
            <th className="py-2 font-medium">Email</th>
            <th className="py-2 font-medium">Subscribed</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((s) => (
            <tr key={s.id} className="border-t border-white/10">
              <td className="py-2">{s.email}</td>
              <td className="py-2 text-muted">{s.createdAt.toISOString().slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
