// Read typed values from submitted admin forms. Empty fields become null.

export function text(form: FormData, key: string) {
  const value = form.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function requiredText(form: FormData, key: string) {
  const value = text(form, key);
  if (value === null) throw new Error(`${key} is required`);
  return value;
}

export function int(form: FormData, key: string) {
  const value = text(form, key);
  if (value === null) return null;
  const parsed = Number.parseInt(value.replace(/[,\s$]/g, ""), 10);
  if (Number.isNaN(parsed)) throw new Error(`${key} must be a whole number`);
  return parsed;
}

export function decimal(form: FormData, key: string) {
  const value = text(form, key);
  if (value === null) return null;
  const cleaned = value.replace(/[,\s$]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) throw new Error(`${key} must be an amount like 49.99`);
  return cleaned;
}

export function oneOf<T extends string>(form: FormData, key: string, options: readonly T[]) {
  const value = text(form, key);
  if (value === null) return null;
  if (!options.includes(value as T)) throw new Error(`${key} has an unknown value`);
  return value as T;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
