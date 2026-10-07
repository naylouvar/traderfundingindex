import type { Rule, Severity } from "@prisma/client";
import { Markdown } from "@/components/markdown";
import { ruleCategoryLabel } from "@/lib/format";

const severityLabel: Record<Severity, string> = {
  HIGH: "High impact",
  MEDIUM: "Medium impact",
  LOW: "Low impact",
};

const severityStyle: Record<Severity, string> = {
  HIGH: "bg-red-500/15 text-red-300",
  MEDIUM: "bg-amber-500/15 text-amber-300",
  LOW: "bg-white/10 text-muted",
};

// One fine-print finding: the firm's own wording, then our breakdown of what it costs the trader.
export function FinePrintCard({ rule }: { rule: Rule }) {
  return (
    <article className="space-y-3 rounded-lg border border-white/10 p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`rounded px-1.5 py-0.5 ${severityStyle[rule.severity]}`}>{severityLabel[rule.severity]}</span>
        <span className="rounded bg-white/5 px-1.5 py-0.5 text-muted">{ruleCategoryLabel[rule.category]}</span>
      </div>
      {rule.title && <h3 className="text-lg font-semibold">{rule.title}</h3>}
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted">What the terms say</p>
        <blockquote className="border-l-2 border-white/20 pl-3 text-sm text-muted">{rule.text}</blockquote>
      </div>
      {rule.impact && (
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-accent">What it really means</p>
          <div className="text-sm">
            <Markdown source={rule.impact} />
          </div>
        </div>
      )}
      {rule.sourceUrl && (
        <a href={rule.sourceUrl} rel="nofollow noopener" className="text-xs text-muted underline">
          Source
        </a>
      )}
    </article>
  );
}
