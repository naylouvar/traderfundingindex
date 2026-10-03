import type { ReactNode } from "react";
import type { EditableSection } from "@/lib/content";
import { saveSection } from "../actions";

export function SectionForm({
  section,
  title,
  hint,
  returnTo,
  children,
}: {
  section: EditableSection;
  title: string;
  hint?: ReactNode;
  returnTo: string;
  children: ReactNode;
}) {
  return (
    <section id={section} className="scroll-mt-24 space-y-4 rounded-lg border border-white/10 p-5">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {hint && <p className="text-sm text-muted">{hint}</p>}
      </div>
      <form action={saveSection} className="space-y-4">
        <input type="hidden" name="section" value={section} />
        <input type="hidden" name="returnTo" value={returnTo} />
        {children}
        <div className="flex flex-wrap items-center gap-4">
          <button className="btn-primary">Save</button>
          <label className="flex items-center gap-2 text-xs text-muted">
            <input type="checkbox" name="reset" /> Reset this block to the default text
          </label>
        </div>
      </form>
    </section>
  );
}

export function Field({
  label,
  name,
  value,
  long,
  rows = 3,
  placeholder,
}: {
  label: string;
  name: string;
  value?: string | null;
  long?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="text-muted">{label}</span>
      {long ? (
        <textarea name={name} defaultValue={value ?? ""} rows={rows} placeholder={placeholder} className="input" />
      ) : (
        <input name={name} defaultValue={value ?? ""} placeholder={placeholder} className="input" />
      )}
    </label>
  );
}

export function SavedNote({ saved, labels }: { saved: unknown; labels: Record<string, string> }) {
  if (typeof saved !== "string" || !labels[saved]) return null;
  return <p className="rounded-md bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">{labels[saved]} saved.</p>;
}
