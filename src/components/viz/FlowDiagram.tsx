import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FlowNode {
  id: string;
  label: string;
  description?: string;
  color: string;
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

interface Props {
  nodes: FlowNode[];
  edges: FlowEdge[];
  direction?: "horizontal" | "vertical";
}

export default function FlowDiagram({ nodes, edges, direction = "horizontal" }: Props) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const isHorizontal = direction === "horizontal";

  return (
    <div className="rounded-xl border border-bg-border bg-bg-card p-6 overflow-x-auto">
      <div className={`flex ${isHorizontal ? "flex-row" : "flex-col"} items-center gap-2 min-w-fit`}>
        {nodes.map((node, i) => {
          const edge = i < edges.length ? edges[i] : null;
          return (
            <div key={node.id} className={`flex ${isHorizontal ? "flex-row" : "flex-col"} items-center gap-2`}>
              {/* Node */}
              <motion.div
                className="relative cursor-pointer rounded-lg border-2 px-4 py-3 text-center min-w-[120px]"
                style={{
                  borderColor: activeNode === node.id ? node.color : "#1e1e2e",
                  backgroundColor: activeNode === node.id ? `${node.color}15` : "transparent",
                }}
                whileHover={{ scale: 1.05 }}
                role="button"
                tabIndex={0}
                onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveNode(activeNode === node.id ? null : node.id); } }}
                aria-expanded={activeNode === node.id}
              >
                <p className="text-sm font-medium" style={{ color: node.color }}>
                  {node.label}
                </p>
              </motion.div>

              {/* Arrow */}
              {edge && (
                <div className={`flex ${isHorizontal ? "flex-col" : "flex-row"} items-center gap-1`}>
                  <span className="text-text-secondary text-xs">
                    {isHorizontal ? "→" : "↓"}
                  </span>
                  {edge.label && (
                    <span className="text-[10px] text-text-secondary whitespace-nowrap">
                      {edge.label}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="rounded-lg bg-bg border border-bg-border p-4">
              <p className="text-sm text-text-secondary">
                {nodes.find((n) => n.id === activeNode)?.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
