import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Single-admin login: the password lives in ADMIN_PASSWORD and the session is
// a signed, expiring cookie. Member accounts come later with the forum.

const COOKIE = "tfi_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters");
  }
  return value;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function passwordMatches(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Compare HMACs so the check takes the same time whatever the input length.
  return safeEqual(sign(password), sign(expected));
}

export async function createSession() {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = String(expires);
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature || !safeEqual(sign(payload), signature)) return false;
  return Number(payload) > Date.now() / 1000;
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
