import type { ReactNode } from "react";

type InputProps = {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

export function Field({ label, name, defaultValue, type = "text", required, placeholder, className }: InputProps) {
  return (
    <label className={`block space-y-1 text-sm ${className ?? ""}`}>
      <span className="text-muted">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className="input"
      />
    </label>
  );
}

export function TextArea({ label, name, defaultValue, required, placeholder, className }: InputProps) {
  return (
    <label className={`block space-y-1 text-sm ${className ?? ""}`}>
      <span className="text-muted">{label}</span>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        rows={3}
        className="input"
      />
    </label>
  );
}

export function Select({
  label,
  name,
  defaultValue,
  options,
  allowEmpty,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: Record<string, string>;
  allowEmpty?: boolean;
  className?: string;
}) {
  return (
    <label className={`block space-y-1 text-sm ${className ?? ""}`}>
      <span className="text-muted">{label}</span>
      <select name={name} defaultValue={defaultValue ?? ""} className="input">
        {allowEmpty && <option value="">—</option>}
        {Object.entries(options).map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 space-y-4 rounded-lg border border-white/10 p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export const firmStatusOptions = { ACTIVE: "Active", UNDER_WATCH: "Under watch", CLOSED: "Closed" };
export const assetClassOptions = { FUTURES: "Futures", FOREX: "Forex", CRYPTO: "Crypto" };
export const drawdownOptions = {
  END_OF_DAY_TRAILING: "End-of-day trailing",
  INTRADAY_TRAILING: "Intraday trailing",
  STATIC: "Static",
};
export const ruleCategoryOptions = {
  NEWS: "News trading",
  CONSISTENCY: "Consistency",
  CONTRACT_LIMIT: "Contract limit",
  TRADING_HOURS: "Trading hours",
  OVERNIGHT: "Overnight / weekend",
  AUTOMATION: "Automation / bots",
  IP_VPN: "IP / VPN",
  PAYOUT: "Payout",
  OTHER: "Other",
};
export const severityOptions = { LOW: "Low", MEDIUM: "Medium", HIGH: "High" };
export const countryStatusOptions = { BANNED: "Banned", RESTRICTED: "Restricted", ALLOWED: "Allowed" };
