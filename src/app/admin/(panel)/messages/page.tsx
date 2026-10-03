import { db } from "@/lib/db";
import { deleteMessage, setMessageRead } from "../../actions";

export default async function MessagesAdmin() {
  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  const unread = messages.filter((m) => !m.read).length;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="text-sm text-muted">
          Sent from the contact page. {unread > 0 ? `${unread} unread.` : "All read."}
        </p>
      </div>
      {messages.length === 0 ? (
        <p className="rounded-lg border border-white/10 p-8 text-center text-muted">No messages yet.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className={`rounded-lg border p-4 ${m.read ? "border-white/10" : "border-accent/40 bg-accent/[0.04]"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="font-medium">
                    {!m.read && <span className="mr-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold uppercase text-black">New</span>}
                    {m.subject ?? "(no subject)"}
                  </p>
                  <p className="text-sm text-muted">
                    {m.name} ·{" "}
                    <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject ?? "your message"}`)}`} className="underline hover:text-foreground">
                      {m.email}
                    </a>
                  </p>
                </div>
                <time className="text-xs text-muted">{m.createdAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</time>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/85">{m.message}</p>
              <div className="mt-3 flex gap-2">
                <form action={setMessageRead.bind(null, m.id, !m.read)}>
                  <button className="btn-secondary py-1 text-xs">{m.read ? "Mark unread" : "Mark read"}</button>
                </form>
                <form action={deleteMessage.bind(null, m.id)}>
                  <button className="btn-danger py-1 text-xs">Delete</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
