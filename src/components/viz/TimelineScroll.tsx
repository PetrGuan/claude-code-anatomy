import { motion } from "framer-motion";

interface TimelineStep {
  icon: string;
  title: string;
  description: string;
  color: string;
  link?: string;
}

const steps: TimelineStep[] = [
  {
    icon: "⌨️",
    title: "用户输入",
    description: "你在终端输入 '帮我修复这个 bug'。PromptInput 组件捕获输入，附加当前目录、git 状态等上下文信息。",
    color: "#e0e0e8",
  },
  {
    icon: "🛡️",
    title: "权限检查",
    description: "三层防线启动：ML 分类器快速判断安全性 → 规则引擎匹配用户自定义策略 → 必要时弹出确认对话框。",
    color: "#f59e0b",
    link: "/permission-security",
  },
  {
    icon: "📋",
    title: "系统提示构建",
    description: "拼装完整上下文：默认系统提示 + 用户环境信息 + 45 个工具定义 + 记忆附件 + 项目规则。像服务员把你的简单点单翻译成厨房能懂的完整订单。",
    color: "#22d3ee",
    link: "/query-pipeline",
  },
  {
    icon: "🌊",
    title: "流式 API 调用",
    description: "通过 Anthropic API 发送请求。响应以流式返回 — 每个 token 到达时立即渲染到终端，不用等完整回复。async generator 是这一切的骨架。",
    color: "#6c63ff",
    link: "/query-pipeline",
  },
  {
    icon: "🔧",
    title: "工具调用",
    description: "Claude 决定需要读文件、搜索代码、执行命令。工具调度器启动：读操作并行执行（快），写操作串行执行（安全）。",
    color: "#10b981",
    link: "/tool-system",
  },
  {
    icon: "🔄",
    title: "循环与返回",
    description: "工具执行结果返回给 Claude，它分析结果后可能再次调用工具。这个循环持续到任务完成，最终将结果流式渲染到你的终端。",
    color: "#a78bfa",
  },
];

export default function TimelineScroll() {
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
                href={step.link}
                className="inline-block mt-3 text-sm text-accent-purple hover:underline"
              >
                深入了解 →
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
