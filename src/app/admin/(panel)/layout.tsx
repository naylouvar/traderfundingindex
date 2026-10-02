import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link href="/admin" className="font-semibold">
          Admin panel
        </Link>
        <form action={logout}>
          <button className="text-sm text-muted hover:text-foreground">Log out</button>
        </form>
      </div>
      {children}
    </div>
  );
}
