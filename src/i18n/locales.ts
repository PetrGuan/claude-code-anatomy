export type Locale = "en" | "zh";

export const defaultLocale: Locale = "en";
export const locales: Locale[] = ["en", "zh"];

const BASE = "/claude-code-anatomy";

export function getLocalePath(locale: Locale, path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return `${BASE}${cleanPath}`;
  return `${BASE}/${locale}${cleanPath}`;
}

export function getAlternatePath(currentLocale: Locale, currentPath: string): string {
  const stripped = currentPath.replace(new RegExp("^" + BASE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), "");
  const withoutLocale = stripped.replace(/^\/(en|zh)/, "");
  const path = withoutLocale || "/";
  const targetLocale: Locale = currentLocale === "en" ? "zh" : "en";
  return getLocalePath(targetLocale, path);
}

export function getLocaleFromPath(path: string): Locale {
  const stripped = path.replace(BASE, "");
  if (stripped.startsWith("/zh")) return "zh";
  return "en";
}
