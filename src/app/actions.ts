"use server";

import { db } from "@/lib/db";

export async function subscribe(_state: "ok" | "invalid" | null, form: FormData) {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return "invalid" as const;
  await db.newsletterSubscriber.upsert({ where: { email }, create: { email }, update: {} });
  return "ok" as const;
}

export async function sendContact(_state: "ok" | "invalid" | null, form: FormData) {
  const field = (key: string, max: number) => String(form.get(key) ?? "").trim().slice(0, max);
  if (field("website", 200)) return "ok" as const; // honeypot filled: quietly drop
  const name = field("name", 100);
  const email = field("email", 254).toLowerCase();
  const subject = field("subject", 150) || null;
  const message = field("message", 5000);
  if (!name || message.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "invalid" as const;
  await db.contactMessage.create({ data: { name, email, subject, message } });
  return "ok" as const;
}
