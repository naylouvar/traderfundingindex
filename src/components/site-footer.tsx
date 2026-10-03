import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Brand } from "@/components/brand";
import { getContent } from "@/lib/content";

const SOCIAL: { key: "x" | "discord" | "youtube" | "telegram" | "instagram"; label: string; icon: ReactNode }[] = [
  {
    key: "x",
    label: "X",
    icon: <path d="M17.8 3h3.1l-6.8 7.8 8 10.2h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.9 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" />,
  },
  {
    key: "discord",
    label: "Discord",
    icon: <path d="M19.6 5.3A17 17 0 0 0 15.4 4l-.5 1a15.7 15.7 0 0 0-5.8 0L8.6 4a17 17 0 0 0-4.2 1.3C1.7 9.3 1 13.2 1.3 17a17 17 0 0 0 5.2 2.6l1.1-1.8c-.6-.2-1.2-.5-1.8-.9l.4-.3a12.2 12.2 0 0 0 11.6 0l.4.3c-.6.4-1.2.7-1.8.9l1.1 1.8a17 17 0 0 0 5.2-2.6c.4-4.4-.7-8.2-3.1-11.7ZM8.5 14.7c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Zm7 0c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Z" />,
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: <path d="M22.5 7.2a2.8 2.8 0 0 0-2-2C18.8 4.7 12 4.7 12 4.7s-6.8 0-8.5.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.7.5 8.5.5 8.5.5s6.8 0 8.5-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-4.8ZM9.8 15V9l5.7 3-5.7 3Z" />,
  },
  {
    key: "telegram",
    label: "Telegram",
    icon: <path d="M21.9 4.3 18.7 19.4c-.2 1-.9 1.3-1.7.8l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2l-11 6.9-4.7-1.5c-1-.3-1-1 .2-1.5L20.5 3c.9-.3 1.6.2 1.4 1.3Z" />,
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21.9 8c0-1.6-.5-3-1.6-4.2A5.9 5.9 0 0 0 16 2.1C14.4 2 9.6 2 8 2.1c-1.6 0-3 .5-4.2 1.6A5.9 5.9 0 0 0 2.1 8C2 9.6 2 14.4 2.1 16c0 1.6.5 3 1.6 4.2A5.9 5.9 0 0 0 8 21.9c1.6.1 6.4.1 8 0 1.6 0 3-.5 4.2-1.6a5.9 5.9 0 0 0 1.6-4.3c.1-1.6.1-6.4 0-8Z" />,
  },
];

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return /^https?:\/\//.test(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-foreground/75 transition-colors hover:text-accent">
      {children}
    </a>
  ) : (
    <Link href={href} className="text-foreground/75 transition-colors hover:text-accent">
      {children}
    </Link>
  );
}

export async function SiteFooter() {
  const site = await getContent();
  const social = SOCIAL.filter((s) => /^https?:\/\//.test(site.footer[s.key] ?? ""));
  return (
    <footer className="mt-24 border-t border-white/10">
      <div
        style={{ "--cols": site.footer.columns.length } as CSSProperties}
        className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[2fr_repeat(var(--cols),minmax(0,1fr))]"
      >
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <Brand brand={site.brand} />
          <p className="max-w-sm text-sm leading-relaxed text-muted">{site.footer.tagline}</p>
          {social.length > 0 && (
            <ul className="flex gap-2">
              {social.map((s) => (
                <li key={s.key}>
                  <a
                    href={site.footer[s.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-muted transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      {s.icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        {site.footer.columns.map((col) => (
          <div key={col.title} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">{col.title}</h3>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.href ? <FooterLink href={link.href}>{link.label}</FooterLink> : <span className="text-muted/50">{link.label}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl space-y-3 px-4 py-6 text-xs text-muted">
          <p className="leading-relaxed">{site.footer.disclaimer}</p>
          <p>
            © {new Date().getFullYear()} {site.brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
