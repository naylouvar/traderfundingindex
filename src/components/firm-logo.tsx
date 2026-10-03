export function FirmLogo({ name, logoUrl, size = 36 }: { name: string; logoUrl: string | null; size?: number }) {
  const style = { width: size, height: size };
  if (logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element -- logos come from any host set in the admin panel
    return <img src={logoUrl} alt="" style={style} className="shrink-0 rounded-lg bg-white/5 object-contain" />;
  }
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span
      style={style}
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent"
    >
      {initials}
    </span>
  );
}
