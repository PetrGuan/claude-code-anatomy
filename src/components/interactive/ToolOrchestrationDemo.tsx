import { useState } from "react";
import { motion } from "framer-motion";

const scenario = [
  { name: "Glob('*.ts')", type: "read" as const, duration: 0.3, color: "#6c63ff" },
  { name: "Grep('TODO')", type: "read" as const, duration: 0.4, color: "#6c63ff" },
  { name: "Read('main.tsx')", type: "read" as const, duration: 0.2, color: "#6c63ff" },
  { name: "Edit('main.tsx')", type: "write" as const, duration: 0.5, color: "#f59e0b" },
  { name: "Write('test.ts')", type: "write" as const, duration: 0.4, color: "#f59e0b" },
  { name: "Bash('npm test')", type: "write" as const, duration: 1.0, color: "#ef4444" },
];

export default function ToolOrchestrationDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(-1);

  const readOps = scenario.filter((t) => t.type === "read");
  const writeOps = scenario.filter((t) => t.type === "write");

  function play() {
    setIsPlaying(true);
    setStep(0);
    setTimeout(() => setStep(1), 1000);
    setTimeout(() => setStep(2), 1800);
    setTimeout(() => setStep(3), 2400);
    setTimeout(() => setStep(4), 3600);
    setTimeout(() => { setStep(5); setIsPlaying(false); }, 4000);
  }

  return (
    <div className="rounded-xl border border-bg-border bg-bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-medium text-text">工具调度模拟器</p>
        <button
          onClick={play}
          disabled={isPlaying}
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-accent-purple text-white disabled:opacity-50 hover:bg-accent-purple/80 transition-colors"
        >
          {isPlaying ? "执行中..." : "▶ 运行"}
        </button>
      </div>

      <div className="mb-6">
        <p className="text-xs font-mono text-text-secondary mb-2">阶段 1 — 读操作（并行）</p>
        <div className="space-y-2">
          {readOps.map((op, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-mono w-32 text-text-secondary">{op.name}</span>
              <div className="flex-1 h-6 bg-bg rounded relative overflow-hidden">
                <motion.div
                  className="h-full rounded"
                  style={{ backgroundColor: op.color }}
                  initial={{ width: 0, opacity: 0.6 }}
                  animate={step >= 0 ? { width: `${Math.min(op.duration * 200, 100)}%`, opacity: 0.6 } : {}}
                  transition={{ duration: op.duration, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs font-mono w-8 text-text-secondary">
                {step >= 1 ? "✓" : step >= 0 ? "..." : ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-mono text-text-secondary mb-2">阶段 2 — 写操作（串行）</p>
        <div className="space-y-2">
          {writeOps.map((op, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-mono w-32 text-text-secondary">{op.name}</span>
              <div className="flex-1 h-6 bg-bg rounded relative overflow-hidden">
                <motion.div
                  className="h-full rounded"
                  style={{ backgroundColor: op.color }}
                  initial={{ width: 0, opacity: 0.6 }}
                  animate={step >= i + 2 ? { width: `${Math.min(op.duration * 150, 100)}%`, opacity: 0.6 } : {}}
                  transition={{ duration: op.duration, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs font-mono w-8 text-text-secondary">
                {step >= i + 2 ? "✓" : step >= i + 1 && i === 0 ? "..." : ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      {step >= 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-sm text-accent-emerald text-center"
        >
          读操作同时完成（0.4s），写操作依次执行（1.9s）— 总计 2.3s 而非串行的 2.8s
        </motion.div>
      )}
    </div>
  );
}
