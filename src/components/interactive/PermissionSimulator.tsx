import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "../../i18n/translations";
import type { Locale } from "../../i18n/locales";

interface LayerResult {
  layer: string;
  decision: "allow" | "deny" | "pass" | "ask";
  reason: string;
  color: string;
}

interface Scenario {
  command: string;
  description: string;
  layers: LayerResult[];
  finalDecision: "allow" | "deny" | "ask";
}

interface Props {
  locale?: Locale;
}

export default function PermissionSimulator({ locale = "en" as Locale }: Props) {
  const scenarios: Scenario[] = [
    {
      command: "git status",
      description: t(locale, "permissionSimulator.scenario1Desc"),
      layers: [
        { layer: t(locale, "permissionSimulator.mlClassifier"), decision: "allow" as const, reason: t(locale, "permissionSimulator.s1l1Reason"), color: "#10b981" },
        { layer: t(locale, "permissionSimulator.ruleEngine"), decision: "pass" as const, reason: t(locale, "permissionSimulator.s1l2Reason"), color: "#7c829d" },
        { layer: t(locale, "permissionSimulator.userConfirm"), decision: "pass" as const, reason: t(locale, "permissionSimulator.s1l3Reason"), color: "#7c829d" },
      ],
      finalDecision: "allow" as const,
    },
    {
      command: "rm -rf /",
      description: t(locale, "permissionSimulator.scenario2Desc"),
      layers: [
        { layer: t(locale, "permissionSimulator.mlClassifier"), decision: "deny" as const, reason: t(locale, "permissionSimulator.s2l1Reason"), color: "#ef4444" },
        { layer: t(locale, "permissionSimulator.ruleEngine"), decision: "pass" as const, reason: t(locale, "permissionSimulator.s2l2Reason"), color: "#7c829d" },
        { layer: t(locale, "permissionSimulator.userConfirm"), decision: "pass" as const, reason: t(locale, "permissionSimulator.s2l3Reason"), color: "#7c829d" },
      ],
      finalDecision: "deny" as const,
    },
    {
      command: "npm install lodash",
      description: t(locale, "permissionSimulator.scenario3Desc"),
      layers: [
        { layer: t(locale, "permissionSimulator.mlClassifier"), decision: "pass" as const, reason: t(locale, "permissionSimulator.s3l1Reason"), color: "#f59e0b" },
        { layer: t(locale, "permissionSimulator.ruleEngine"), decision: "pass" as const, reason: t(locale, "permissionSimulator.s3l2Reason"), color: "#f59e0b" },
        { layer: t(locale, "permissionSimulator.userConfirm"), decision: "ask" as const, reason: t(locale, "permissionSimulator.s3l3Reason"), color: "#6c63ff" },
      ],
      finalDecision: "ask" as const,
    },
    {
      command: "cat src/main.tsx",
      description: t(locale, "permissionSimulator.scenario4Desc"),
      layers: [
        { layer: t(locale, "permissionSimulator.mlClassifier"), decision: "allow" as const, reason: t(locale, "permissionSimulator.s4l1Reason"), color: "#10b981" },
        { layer: t(locale, "permissionSimulator.ruleEngine"), decision: "pass" as const, reason: t(locale, "permissionSimulator.s4l2Reason"), color: "#7c829d" },
        { layer: t(locale, "permissionSimulator.userConfirm"), decision: "pass" as const, reason: t(locale, "permissionSimulator.s4l3Reason"), color: "#7c829d" },
      ],
      finalDecision: "allow" as const,
    },
  ];

  const decisionLabels = {
    allow: { text: t(locale, "permissionSimulator.resultAllow"), color: "#10b981" },
    deny: { text: t(locale, "permissionSimulator.resultDeny"), color: "#ef4444" },
    ask: { text: t(locale, "permissionSimulator.resultAsk"), color: "#6c63ff" },
  };

  const [selected, setSelected] = useState<number | null>(null);
  const [step, setStep] = useState(-1);

  function runScenario(idx: number) {
    setSelected(idx);
    setStep(0);
    setTimeout(() => setStep(1), 600);
    setTimeout(() => setStep(2), 1000);
    setTimeout(() => setStep(3), 1400);
  }

  const scenario = selected !== null ? scenarios[selected] : null;

  return (
    <div className="rounded-xl border border-bg-border bg-bg-card p-6">
      <p className="text-sm font-medium text-text mb-4">{t(locale, "permissionSimulator.title")}</p>

      <div className="grid sm:grid-cols-2 gap-2 mb-6">
        {scenarios.map((s, i) => (
          <button
            key={i}
            onClick={() => runScenario(i)}
            aria-label={`${s.command}`}
            className={`text-left p-3 rounded-lg border text-sm transition-colors ${
              selected === i
                ? "border-accent-purple bg-accent-purple/10"
                : "border-bg-border hover:border-bg-border/80 hover:bg-bg"
            }`}
          >
            <code className="text-accent-purple font-mono text-xs">{s.command}</code>
            <p className="text-text-secondary text-xs mt-1">{s.description}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {scenario && (
          <motion.div
            key={selected}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {scenario.layers.map((layer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={step >= i + 1 ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4 rounded-lg bg-bg p-3 border border-bg-border"
              >
                <div className="flex-shrink-0 w-24">
                  <p className="text-xs font-medium" style={{ color: layer.color }}>{layer.layer}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-secondary">{layer.reason}</p>
                </div>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{ color: layer.color, backgroundColor: `${layer.color}15` }}
                >
                  {layer.decision === "allow"
                    ? t(locale, "permissionSimulator.allow")
                    : layer.decision === "deny"
                    ? t(locale, "permissionSimulator.deny")
                    : layer.decision === "ask"
                    ? t(locale, "permissionSimulator.ask")
                    : t(locale, "permissionSimulator.pass")}
                </span>
              </motion.div>
            ))}

            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center pt-4 border-t border-bg-border"
              >
                <span className="text-lg font-bold" style={{ color: decisionLabels[scenario.finalDecision].color }}>
                  {decisionLabels[scenario.finalDecision].text}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
