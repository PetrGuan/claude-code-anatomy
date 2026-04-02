import { useEffect, useRef, useState, useCallback } from "react";
import { select } from "d3-selection";
import { zoom } from "d3-zoom";
import "d3-transition";
import { nodes, edges, layerColors, layerLabels, nodeLabel, layerLabel, type GraphNode } from "../../data/architecture";
import { modules, moduleName, moduleDesc } from "../../data/modules";
import type { Locale } from "../../i18n/locales";

export default function ArchitectureMap({ locale = "en" as Locale }: { locale?: Locale }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: GraphNode } | null>(null);

  const render = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Read current theme colors from CSS variables
    const styles = getComputedStyle(document.documentElement);
    const textColor = `rgb(${styles.getPropertyValue("--color-text").trim()})`;
    const borderColor = `rgb(${styles.getPropertyValue("--color-bg-border").trim()})`;
    const secondaryColor = `rgb(${styles.getPropertyValue("--color-text-secondary").trim()})`;

    const width = containerRef.current.clientWidth;
    const baseHeight = 500;
    const height = Math.max(300, Math.min(baseHeight, width * 0.8));
    const s = height / baseHeight;
    const svg = select(svgRef.current).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    const layerY: Record<string, number> = {
      core: 120 * s,
      ui: 240 * s,
      extension: 340 * s,
      integration: 440 * s,
    };

    const positionedNodes = nodes.map((node) => {
      const layerNodes = nodes.filter((n) => n.layer === node.layer);
      const idx = layerNodes.indexOf(node);
      const spacing = width / (layerNodes.length + 1);
      return { ...node, x: spacing * (idx + 1), y: layerY[node.layer] };
    });

    const nodeMap = new Map(positionedNodes.map((n) => [n.id, n]));

    for (const layer of Object.keys(layerY)) {
      const layerNodes = positionedNodes.filter((n) => n.layer === layer);
      if (layerNodes.length === 0) continue;

      const padding = 60 * s;
      const minX = Math.min(...layerNodes.map((n) => n.x!)) - padding;
      const maxX = Math.max(...layerNodes.map((n) => n.x!)) + padding;
      const y = layerY[layer];

      g.append("rect")
        .attr("x", minX).attr("y", y - 30 * s)
        .attr("width", maxX - minX).attr("height", 60 * s)
        .attr("rx", 12).attr("fill", layerColors[layer]).attr("opacity", 0.05);

      g.append("text")
        .attr("x", minX + 8).attr("y", y - 16 * s)
        .attr("fill", layerColors[layer]).attr("font-size", Math.max(8, 10 * s)).attr("opacity", 0.6)
        .text(layerLabel(layer, locale));
    }

    g.selectAll("line")
      .data(edges).enter().append("line")
      .attr("x1", (d) => nodeMap.get(d.source)?.x ?? 0)
      .attr("y1", (d) => nodeMap.get(d.source)?.y ?? 0)
      .attr("x2", (d) => nodeMap.get(d.target)?.x ?? 0)
      .attr("y2", (d) => nodeMap.get(d.target)?.y ?? 0)
      .attr("stroke", borderColor).attr("stroke-width", 1.5).attr("opacity", 0.6);

    const nodeGroups = g.selectAll("g.node")
      .data(positionedNodes).enter().append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer");

    nodeGroups.append("circle")
      .attr("r", Math.max(14, 20 * s)).attr("fill", (d) => layerColors[d.layer])
      .attr("opacity", 0.15).attr("stroke", (d) => layerColors[d.layer]).attr("stroke-width", 1.5);

    nodeGroups.append("circle")
      .attr("r", Math.max(3, 5 * s)).attr("fill", (d) => layerColors[d.layer]);

    nodeGroups.append("text")
      .attr("y", 34 * s).attr("text-anchor", "middle")
      .attr("fill", textColor).attr("font-size", Math.max(8, 11 * s))
      .text((d) => nodeLabel(d, locale));

    // Click navigation
    nodeGroups
      .on("click", (event, d) => {
        const mod = modules.find((m) => m.id === d.id);
        if (mod?.page) window.location.href = "/claude-code-anatomy" + mod.page;
      });

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => g.attr("transform", event.transform));

    svg.call(zoomBehavior);

    nodeGroups
      .on("mouseenter", function (event, d) {
        const rect = containerRef.current!.getBoundingClientRect();
        setTooltip({ x: event.clientX - rect.left, y: event.clientY - rect.top - 10, node: d });
        select(this).select("circle").transition().duration(200).attr("r", Math.max(17, 24 * s));
      })
      .on("mouseleave", function () {
        setTooltip(null);
        select(this).select("circle").transition().duration(200).attr("r", Math.max(14, 20 * s));
      });
  }, [locale]);

  useEffect(() => {
    render();
    const resizeObserver = new ResizeObserver(() => render());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    // Re-render when theme changes
    const themeObserver = new MutationObserver(() => render());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { resizeObserver.disconnect(); themeObserver.disconnect(); };
  }, [render]);

  return (
    <div ref={containerRef} className="relative rounded-xl border border-bg-border bg-bg-card p-4 overflow-hidden">
      <svg ref={svgRef} className="w-full" />
      {tooltip && (() => {
        const mod = modules.find(m => m.id === tooltip.node.id);
        return (
          <div
            className="absolute z-10 rounded-lg border border-bg-border bg-bg p-3 shadow-xl pointer-events-none max-w-xs"
            style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
          >
            <p className="font-medium text-sm" style={{ color: layerColors[tooltip.node.layer] }}>
              {nodeLabel(tooltip.node, locale)}
            </p>
            {mod && (
              <>
                <p className="text-text-secondary text-xs mt-1.5 leading-relaxed">
                  {moduleDesc(mod, locale)}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary/70 font-mono">
                  <span>{mod.files} {locale === "zh" ? "文件" : "files"}</span>
                  <span>·</span>
                  <span>{(mod.lines / 1000).toFixed(0)}K {locale === "zh" ? "行" : "LOC"}</span>
                  {mod.page && (
                    <>
                      <span>·</span>
                      <span className="text-accent-purple">{locale === "zh" ? "可点击" : "click to view"}</span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })()}
    </div>
  );
}
