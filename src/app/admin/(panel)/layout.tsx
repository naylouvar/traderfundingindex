import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";

const adminNav = [
  { label: "Firms", href: "/admin" },
  { label: "Challenges", href: "/admin/challenges" },
  { label: "Offers", href: "/admin/offers" },
  { label: "Reviews", href: "/admin/reviews" },
  { label: "Homepage", href: "/admin/homepage" },
  { label: "Subscribers", href: "/admin/subscribers" },
];

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Link href="/admin" className="font-semibold">
            Admin
          </Link>
          {adminNav.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logout}>
          <button className="text-sm text-muted hover:text-foreground">Log out</button>
        </form>
      </div>
      {children}
    </div>
  );
}
