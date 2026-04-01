import { useState, type ReactNode } from "react";

interface Props {
  plain: ReactNode;
  technical: ReactNode;
  plainLabel?: string;
  technicalLabel?: string;
}

export default function LayerToggle({
  plain,
  technical,
  plainLabel = "通俗版",
  technicalLabel = "技术版",
}: Props) {
  const [isTechnical, setIsTechnical] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center gap-1 rounded-lg bg-bg-card p-1 w-fit border border-bg-border">
        <div role="group" aria-label="内容深度切换">
        <button
          onClick={() => setIsTechnical(false)}
          aria-pressed={!isTechnical}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            !isTechnical
              ? "bg-accent-purple text-white"
              : "text-text-secondary hover:text-text"
          }`}
        >
          {plainLabel}
        </button>
        <button
          onClick={() => setIsTechnical(true)}
          aria-pressed={isTechnical}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            isTechnical
              ? "bg-accent-purple text-white"
              : "text-text-secondary hover:text-text"
          }`}
        >
          {technicalLabel}
        </button>
        </div>
      </div>
      <div>
        {isTechnical ? technical : plain}
      </div>
    </div>
  );
}
