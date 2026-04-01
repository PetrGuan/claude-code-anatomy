import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "../../i18n/translations";
import type { Locale } from "../../i18n/locales";
import { getTraceSteps, type TraceStep } from "../../data/traceSteps";

interface Props {
  locale?: Locale;
}

export default function CodeTracer({ locale = "en" as Locale }: Props) {
  const steps = useMemo(() => getTraceSteps(locale), [locale]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([0]);

  const current = steps[currentIndex];

  const goToStep = useCallback((stepId: string) => {
    const idx = steps.findIndex(s => s.id === stepId);
    if (idx >= 0) {
      setCurrentIndex(idx);
      setHistory(prev => [...prev, idx]);
    }
  }, [steps]);

  const goToIndex = useCallback((idx: number) => {
    setCurrentIndex(idx);
    setHistory(prev => [...prev, idx]);
  }, []);

  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length <= 1) return prev;
      const newHistory = prev.slice(0, -1);
      setCurrentIndex(newHistory[newHistory.length - 1]);
      return newHistory;
    });
  }, []);

  // Render code with clickable refs and line highlighting
  function renderCode(step: TraceStep) {
    const lines = step.code.split("\n");
    return (
      <div className="font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
        {lines.map((line, i) => {
          const lineNum = i + 1;
          const isHighlighted = step.highlightLines.includes(lineNum);

          // Process clickable refs in this line
          let segments: (string | { text: string; targetStep: string })[] = [line];
          for (const ref of step.clickableRefs) {
            const newSegments: typeof segments = [];
            for (const seg of segments) {
              if (typeof seg === "string" && seg.includes(ref.text)) {
                const parts = seg.split(ref.text);
                for (let j = 0; j < parts.length; j++) {
                  if (j > 0) newSegments.push({ text: ref.text, targetStep: ref.targetStep });
                  if (parts[j]) newSegments.push(parts[j]);
                }
              } else {
                newSegments.push(seg);
              }
            }
            segments = newSegments;
          }

          return (
            <div
              key={i}
              className={`flex ${isHighlighted ? "bg-accent-amber/10 border-l-2 border-accent-amber" : "border-l-2 border-transparent"}`}
            >
              <span className="w-8 sm:w-10 flex-shrink-0 text-right pr-3 text-text-secondary/40 select-none">
                {lineNum}
              </span>
              <span className="flex-1 pr-4">
                {segments.map((seg, si) =>
                  typeof seg === "string" ? (
                    <span key={si}>{seg}</span>
                  ) : (
                    <button
                      key={si}
                      onClick={() => goToStep(seg.targetStep)}
                      className="text-accent-purple underline decoration-dotted underline-offset-2 hover:decoration-solid cursor-pointer bg-transparent border-none p-0 font-mono text-inherit focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-1 focus:ring-offset-bg"
                    >
                      {seg.text}
                    </button>
                  )
                )}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // Breadcrumb: show unique visited files
  const breadcrumbSteps = history.map(i => steps[i]);
  // Deduplicate consecutive same files
  const breadcrumbs: { file: string; index: number }[] = [];
  for (const [i, s] of breadcrumbSteps.entries()) {
    if (i === 0 || s.file !== breadcrumbSteps[i - 1].file) {
      breadcrumbs.push({ file: s.file, index: history[i] });
    }
  }

  const stepLabel = t(locale, "codeTracer.stepOf")
    .replace("{n}", String(currentIndex + 1))
    .replace("{total}", String(steps.length));

  return (
    <div className="rounded-xl border border-bg-border bg-bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-bg-border">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="text-xs font-mono text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded whitespace-nowrap">
            {current.file}
          </span>
          <span className="text-xs text-text-secondary whitespace-nowrap">{current.title}</span>
        </div>
        <span className="text-xs text-text-secondary whitespace-nowrap ml-2">{stepLabel}</span>
      </div>

      {/* Breadcrumb trail */}
      {breadcrumbs.length > 1 && (
        <div className="flex items-center gap-1 px-4 py-2 border-b border-bg-border overflow-x-auto text-xs">
          {breadcrumbs.map((bc, i) => (
            <span key={i} className="flex items-center gap-1 whitespace-nowrap">
              {i > 0 && <span className="text-text-secondary/40">{"\u2192"}</span>}
              <button
                onClick={() => goToIndex(bc.index)}
                className={`font-mono px-1.5 py-0.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-1 focus:ring-offset-bg ${
                  bc.index === currentIndex
                    ? "text-accent-purple bg-accent-purple/10"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                {bc.file.split("/").pop()}
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Main content: code + annotation */}
      <div className="flex flex-col lg:flex-row">
        {/* Code panel */}
        <div className="flex-1 p-4 overflow-x-auto border-b lg:border-b-0 lg:border-r border-bg-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderCode(current)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Annotation panel */}
        <div className="lg:w-72 xl:w-80 p-4 flex flex-col justify-between">
          <div>
            <AnimatePresence mode="wait">
              <motion.p
                key={current.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-text-secondary leading-relaxed"
              >
                {current.annotation}
              </motion.p>
            </AnimatePresence>
            {current.clickableRefs.length > 0 && (
              <p className="text-xs text-text-secondary/60 mt-4 italic">
                {t(locale, "codeTracer.clickHint")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-bg-border">
        <button
          onClick={() => {
            if (currentIndex > 0) goToIndex(currentIndex - 1);
            else goBack();
          }}
          disabled={currentIndex === 0 && history.length <= 1}
          className="px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text hover:bg-bg-card transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-1 focus:ring-offset-bg"
        >
          {t(locale, "codeTracer.prev")}
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goToIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-purple ${
                i === currentIndex ? "bg-accent-purple" : "bg-bg-border hover:bg-text-secondary"
              }`}
              aria-label={t(locale, "codeTracer.stepOf").replace("{n}", String(i + 1)).replace("{total}", String(steps.length))}
            />
          ))}
        </div>

        <button
          onClick={() => {
            if (currentIndex < steps.length - 1) goToIndex(currentIndex + 1);
          }}
          disabled={currentIndex === steps.length - 1}
          className="px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text hover:bg-bg-card transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-1 focus:ring-offset-bg"
        >
          {t(locale, "codeTracer.next")}
        </button>
      </div>
    </div>
  );
}
