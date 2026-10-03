"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteContent } from "@/lib/content";

type Nav = SiteContent["nav"];

function isActive(pathname: string, href: string) {
  const path = href.split("#")[0] || "/";
  if (href.includes("#")) return false;
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

export function NavLinks({ nav, mobile = false }: { nav: Nav; mobile?: boolean }) {
  const pathname = usePathname();
  return (
    <>
      {nav.map((item) => {
        const base = mobile ? "block rounded-md px-3 py-2" : "whitespace-nowrap rounded-md px-3 py-1.5";
        if (!item.href) {
          return (
            <span key={item.label} className={`${base} cursor-default text-muted/50`}>
              {item.label}
              {item.note && <span className="ml-1.5 rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase">{item.note}</span>}
            </span>
          );
        }
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={mobile ? (e) => e.currentTarget.closest("details")?.removeAttribute("open") : undefined}
            className={`${base} transition-colors ${
              active ? "bg-white/[0.06] text-foreground" : "text-muted hover:bg-white/[0.04] hover:text-foreground"
            }`}
          >
            {item.label}
            {item.note && <span className="ml-1.5 rounded bg-accent/15 px-1.5 py-0.5 text-[10px] uppercase text-accent">{item.note}</span>}
          </Link>
        );
      })}
    </>
  );
}
