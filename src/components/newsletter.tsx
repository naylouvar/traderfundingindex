"use client";

import { useActionState } from "react";
import { subscribe } from "@/app/actions";
import type { SiteContent } from "@/lib/content";

export function Newsletter({ copy }: { copy: SiteContent["newsletter"] }) {
  const [state, action, pending] = useActionState(subscribe, null);
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-accent/20 via-transparent to-transparent px-6 py-12 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">{copy.eyebrow}</p>
      <h2 className="mx-auto mt-2 max-w-xl text-2xl font-semibold sm:text-3xl">{copy.title}</h2>
      {state === "ok" ? (
        <p className="mt-6 text-sm text-emerald-300">{copy.thanks}</p>
      ) : (
        <form action={action} className="mx-auto mt-6 flex max-w-md gap-2">
          <input name="email" type="email" required placeholder={copy.placeholder} aria-label={copy.placeholder} className="input" />
          <button disabled={pending} className="btn-primary whitespace-nowrap">
            {copy.button}
          </button>
        </form>
      )}
      {state === "invalid" && <p className="mt-3 text-sm text-red-300">Please enter a valid email.</p>}
    </section>
  );
}
