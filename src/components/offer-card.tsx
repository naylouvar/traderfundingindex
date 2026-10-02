import Link from "next/link";
import type { RankedFirm } from "@/lib/firms";
import { FirmLogo } from "./firm-logo";

export function OfferCard({ firm }: { firm: RankedFirm }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <FirmLogo name={firm.name} logoUrl={firm.logoUrl} size={40} />
      <div className="min-w-0 flex-1">
        <Link href={`/firms/${firm.slug}`} className="block truncate text-sm font-semibold hover:text-accent">
          {firm.name}
        </Link>
        <code className="text-xs text-muted">{firm.promoCode}</code>
      </div>
      <div className="flex flex-col items-end gap-1">
        {firm.promoDiscountPct && (
          <span className="rounded bg-accent px-2 py-0.5 text-xs font-bold text-black">{firm.promoDiscountPct}% OFF</span>
        )}
        {firm.promoUrl && (
          <a
            href={firm.promoUrl}
            rel="sponsored nofollow noopener"
            target="_blank"
            className="text-[11px] text-muted underline hover:text-foreground"
          >
            Partner link
          </a>
        )}
      </div>
    </div>
  );
}
