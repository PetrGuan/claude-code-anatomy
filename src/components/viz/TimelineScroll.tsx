import { motion } from "framer-motion";
import { t } from "../../i18n/translations";
import type { Locale } from "../../i18n/locales";

interface TimelineStep {
  icon: string;
  title: string;
  description: string;
  color: string;
  link?: string;
}

interface Props {
  basePath?: string;
  locale?: Locale;
}

export default function TimelineScroll({ basePath = "/claude-code-anatomy", locale = "en" as Locale }: Props) {
  const steps: TimelineStep[] = [
    { icon: "⌨️", title: t(locale, "timeline.step1Title"), description: t(locale, "timeline.step1Desc"), color: "#e0e0e8" },
    { icon: "🛡️", title: t(locale, "timeline.step2Title"), description: t(locale, "timeline.step2Desc"), color: "#f59e0b", link: "/permission-security" },
    { icon: "📋", title: t(locale, "timeline.step3Title"), description: t(locale, "timeline.step3Desc"), color: "#22d3ee", link: "/query-pipeline" },
    { icon: "🌊", title: t(locale, "timeline.step4Title"), description: t(locale, "timeline.step4Desc"), color: "#6c63ff", link: "/query-pipeline" },
    { icon: "🔧", title: t(locale, "timeline.step5Title"), description: t(locale, "timeline.step5Desc"), color: "#10b981", link: "/tool-system" },
    { icon: "🔄", title: t(locale, "timeline.step6Title"), description: t(locale, "timeline.step6Desc"), color: "#a78bfa" },
  ];

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-bg-border" />

      <div className="space-y-16">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative pl-16"
          >
            {/* Node on timeline */}
            <div
              className="absolute left-4 top-1 w-5 h-5 rounded-full border-2 bg-bg"
              style={{ borderColor: step.color }}
            >
              <div
                className="absolute inset-1 rounded-full"
                style={{ backgroundColor: step.color }}
              />
            </div>

            {/* Step number */}
            <span className="text-xs font-mono text-text-secondary">
              Step {i + 1}
            </span>

            {/* Content */}
            <h3 className="text-lg font-semibold mt-1" style={{ color: step.color }}>
              <span className="mr-2">{step.icon}</span>
              {step.title}
            </h3>
            <p className="mt-2 text-text-secondary leading-relaxed max-w-xl">
              {step.description}
            </p>
            {step.link && (
              <a
                href={`${basePath}${step.link}`}
                className="inline-block mt-3 text-sm text-accent-purple hover:underline"
              >
                {t(locale, "common.learnMore")}
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
