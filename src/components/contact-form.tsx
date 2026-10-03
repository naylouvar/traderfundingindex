"use client";

import { useActionState } from "react";
import { sendContact } from "@/app/actions";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, null);
  if (state === "ok") {
    return (
      <p className="card p-6 text-emerald-300">Thanks, your message was sent. We will get back to you by email.</p>
    );
  }
  return (
    <form action={action} className="card space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span className="text-muted">Name</span>
          <input name="name" required maxLength={100} className="input" />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-muted">Email</span>
          <input name="email" type="email" required maxLength={254} className="input" />
        </label>
      </div>
      <label className="block space-y-1 text-sm">
        <span className="text-muted">Subject</span>
        <input name="subject" maxLength={150} className="input" />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-muted">Message</span>
        <textarea name="message" required minLength={10} maxLength={5000} rows={6} className="input" />
      </label>
      {/* Hidden from people; bots that fill it are ignored. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {state === "invalid" && (
        <p className="text-sm text-red-300">Please fill in your name, a valid email and a message of at least 10 characters.</p>
      )}
      <button disabled={pending} className="btn-primary">
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
