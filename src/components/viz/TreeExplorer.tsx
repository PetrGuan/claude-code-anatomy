import { useState } from "react";

interface TreeNode {
  name: string;
  description?: string;
  children?: TreeNode[];
}

interface Props {
  data: TreeNode;
  defaultExpanded?: number;
}

function TreeItem({ node, depth, defaultExpanded }: { node: TreeNode; depth: number; defaultExpanded: number }) {
  const [isOpen, setIsOpen] = useState(depth < defaultExpanded);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded hover:bg-bg-card transition-colors ${
          hasChildren ? "cursor-pointer" : ""
        }`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        role={hasChildren ? "button" : undefined}
        tabIndex={hasChildren ? 0 : undefined}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        onKeyDown={(e) => { if (hasChildren && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setIsOpen(!isOpen); } }}
        aria-expanded={hasChildren ? isOpen : undefined}
      >
        {hasChildren ? (
          <span className={`text-text-secondary text-xs transition-transform ${isOpen ? "rotate-90" : ""}`}>
            ▶
          </span>
        ) : (
          <span className="text-text-secondary text-xs">·</span>
        )}
        <span className={`font-mono text-sm ${hasChildren ? "text-accent-purple" : "text-text"}`}>
          {node.name}
        </span>
        {node.description && (
          <span className="text-xs text-text-secondary ml-2 hidden sm:inline">
            {node.description}
          </span>
        )}
      </div>
      {isOpen && hasChildren && (
        <div>
          {node.children!.map((child, i) => (
            <TreeItem key={i} node={child} depth={depth + 1} defaultExpanded={defaultExpanded} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeExplorer({ data, defaultExpanded = 1 }: Props) {
  return (
    <div className="rounded-xl border border-bg-border bg-bg-card p-4 font-mono text-sm overflow-auto max-h-96">
      <TreeItem node={data} depth={0} defaultExpanded={defaultExpanded} />
    </div>
  );
}
