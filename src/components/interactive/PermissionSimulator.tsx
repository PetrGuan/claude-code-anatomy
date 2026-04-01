import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LayerResult {
  layerCn: string;
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

const scenarios: Scenario[] = [
  {
    command: "git status",
    description: "查看 git 状态（只读操作）",
    layers: [
      { layerCn: "ML 分类器", decision: "allow", reason: "只读 git 命令，置信度 99%", color: "#10b981" },
      { layerCn: "规则引擎", decision: "pass", reason: "已被 ML 放行，跳过", color: "#8888a0" },
      { layerCn: "用户确认", decision: "pass", reason: "已被 ML 放行，跳过", color: "#8888a0" },
    ],
    finalDecision: "allow",
  },
  {
    command: "rm -rf /",
    description: "删除根目录（极度危险）",
    layers: [
      { layerCn: "ML 分类器", decision: "deny", reason: "检测到破坏性命令，置信度 99.9%", color: "#ef4444" },
      { layerCn: "规则引擎", decision: "pass", reason: "已被 ML 拦截，跳过", color: "#8888a0" },
      { layerCn: "用户确认", decision: "pass", reason: "已被 ML 拦截，跳过", color: "#8888a0" },
    ],
    finalDecision: "deny",
  },
  {
    command: "npm install lodash",
    description: "安装 npm 包（中等风险）",
    layers: [
      { layerCn: "ML 分类器", decision: "pass", reason: "置信度 72%，不够确定，交给规则引擎", color: "#f59e0b" },
      { layerCn: "规则引擎", decision: "pass", reason: "无匹配规则", color: "#f59e0b" },
      { layerCn: "用户确认", decision: "ask", reason: "需要用户确认是否允许安装包", color: "#6c63ff" },
    ],
    finalDecision: "ask",
  },
  {
    command: "cat src/main.tsx",
    description: "读取源文件（安全操作）",
    layers: [
      { layerCn: "ML 分类器", decision: "allow", reason: "只读文件操作，置信度 98%", color: "#10b981" },
      { layerCn: "规则引擎", decision: "pass", reason: "已被 ML 放行", color: "#8888a0" },
      { layerCn: "用户确认", decision: "pass", reason: "已被 ML 放行", color: "#8888a0" },
    ],
    finalDecision: "allow",
  },
];

const decisionLabels: Record<string, { text: string; color: string }> = {
  allow: { text: "✓ 允许", color: "#10b981" },
  deny: { text: "✗ 拒绝", color: "#ef4444" },
  ask: { text: "? 需确认", color: "#6c63ff" },
};

export default function PermissionSimulator() {
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
      <p className="text-sm font-medium text-text mb-4">权限模拟器 — 选择一个命令，查看三层防线的判断过程</p>

      <div className="grid sm:grid-cols-2 gap-2 mb-6">
        {scenarios.map((s, i) => (
          <button
            key={i}
            onClick={() => runScenario(i)}
            aria-label={`测试命令: ${s.command}`}
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
                  <p className="text-xs font-medium" style={{ color: layer.color }}>{layer.layerCn}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-secondary">{layer.reason}</p>
                </div>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{ color: layer.color, backgroundColor: `${layer.color}15` }}
                >
                  {layer.decision === "allow" ? "放行" : layer.decision === "deny" ? "拦截" : layer.decision === "ask" ? "转人工" : "跳过"}
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
