"use server";

import { db } from "@/lib/db";

export async function subscribe(_state: "ok" | "invalid" | null, form: FormData) {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return "invalid" as const;
  await db.newsletterSubscriber.upsert({ where: { email }, create: { email }, update: {} });
  return "ok" as const;
}
