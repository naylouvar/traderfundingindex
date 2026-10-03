import { site } from "@/content/site";

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-6 space-y-6">
      <h2 className="text-center text-2xl font-semibold">{site.faq.title}</h2>
      <div className="divide-y divide-white/10 rounded-xl border border-white/10">
        {site.faq.items.map((item) => (
          <details key={item.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
              {item.q}
              <span className="text-muted transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
