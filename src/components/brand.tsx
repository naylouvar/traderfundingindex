import Link from "next/link";
import type { SiteContent } from "@/lib/content";

// The site logo: an uploaded image when set, otherwise the name with one word
// highlighted in the accent colour.
export function Brand({ brand }: { brand: SiteContent["brand"] }) {
  const { name, accent, logoUrl } = brand;
  const at = accent ? name.indexOf(accent) : -1;
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight" aria-label={`${name} home`}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- uploaded logo, any size
        <img src={logoUrl} alt={name} className="h-8 w-auto" />
      ) : (
        <>
          <span aria-hidden className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-sm font-black text-black">
            {name.charAt(0)}
          </span>
          <span>
            {at < 0 ? (
              name
            ) : (
              <>
                {name.slice(0, at)}
                <span className="text-accent">{accent}</span>
                {name.slice(at + accent.length)}
              </>
            )}
          </span>
        </>
      )}
    </Link>
  );
}
