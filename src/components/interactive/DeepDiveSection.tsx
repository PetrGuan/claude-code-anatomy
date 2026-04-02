import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "../../i18n/translations";
import type { Locale } from "../../i18n/locales";

interface DeepDiveItem {
  titleKey: string;
  descKey: string;
  code?: string;
  type: "code" | "type" | "design";
}

interface Props {
  locale?: Locale;
  items: DeepDiveItem[];
}

export default function DeepDiveSection({ locale = "en" as Locale, items }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const typeLabels: Record<string, string> = {
    code: t(locale, "deepDive.realCode"),
    type: t(locale, "deepDive.typeDefinitions"),
    design: t(locale, "deepDive.designDecisions"),
  };

  return (
    <div className="mt-24 rounded-xl border border-bg-border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-bg-card hover:bg-bg-card/80 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-inset"
        aria-expanded={isOpen}
        aria-controls="deep-dive-content"
      >
        <div>
          <h2 className="text-xl font-bold text-accent-purple">{t(locale, "deepDive.title")}</h2>
          <p className="text-sm text-text-secondary mt-1">{t(locale, "deepDive.subtitle")}</p>
        </div>
        <span className="text-sm text-text-secondary whitespace-nowrap ml-4" aria-hidden="true">
          {isOpen ? t(locale, "deepDive.hideMore") : t(locale, "deepDive.showMore")}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="deep-dive-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-6 space-y-8 border-t border-bg-border">
              {items.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent-purple/10 text-accent-purple">
                      {typeLabels[item.type]}
                    </span>
                    <h3 className="text-sm font-semibold text-text">
                      {t(locale, item.titleKey)}
                    </h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-3 whitespace-pre-line">
                    {t(locale, item.descKey)}
                  </p>
                  {item.code && (
                    <div className="rounded-lg bg-bg border border-bg-border overflow-x-auto">
                      <pre className="p-4 text-xs sm:text-sm font-mono leading-relaxed text-text"><code>{item.code}</code></pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
