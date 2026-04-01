import { useState, useEffect } from "react";
import { t } from "../../i18n/translations";
import type { Locale } from "../../i18n/locales";

interface SidebarItem {
  id: string;
  label: string;
  level: number;
}

interface Props {
  items: SidebarItem[];
  locale?: Locale;
}

export default function Sidebar({ items, locale = "en" }: Props) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="hidden lg:block fixed right-8 top-24 w-56">
      <nav className="space-y-1" aria-label={locale === "zh" ? "页面导航" : "Page navigation"}>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
          {t(locale, "common.toc")}
        </p>
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block py-1 text-sm transition-colors border-l-2 ${
              item.level === 1 ? "pl-3" : "pl-6"
            } ${
              activeId === item.id
                ? "border-accent-purple text-accent-purple"
                : "border-transparent text-text-secondary hover:text-text hover:border-bg-border"
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
