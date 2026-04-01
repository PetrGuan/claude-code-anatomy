import { useEffect, useRef, useState, useCallback } from "react";
import { select } from "d3-selection";
import { zoom } from "d3-zoom";
import "d3-transition";
import { nodes, edges, layerColors, layerLabels, type GraphNode } from "../../data/architecture";
import { modules } from "../../data/modules";

export default function ArchitectureMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: GraphNode } | null>(null);

  const render = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 500;
    const svg = select(svgRef.current).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    const layerY: Record<string, number> = { core: 120, ui: 240, extension: 340, integration: 440 };

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

      const minX = Math.min(...layerNodes.map((n) => n.x!)) - 60;
      const maxX = Math.max(...layerNodes.map((n) => n.x!)) + 60;
      const y = layerY[layer];

      g.append("rect")
        .attr("x", minX).attr("y", y - 30)
        .attr("width", maxX - minX).attr("height", 60)
        .attr("rx", 12).attr("fill", layerColors[layer]).attr("opacity", 0.05);

      g.append("text")
        .attr("x", minX + 8).attr("y", y - 16)
        .attr("fill", layerColors[layer]).attr("font-size", 10).attr("opacity", 0.6)
        .text(layerLabels[layer].cn);
    }

    g.selectAll("line")
      .data(edges).enter().append("line")
      .attr("x1", (d) => nodeMap.get(d.source)?.x ?? 0)
      .attr("y1", (d) => nodeMap.get(d.source)?.y ?? 0)
      .attr("x2", (d) => nodeMap.get(d.target)?.x ?? 0)
      .attr("y2", (d) => nodeMap.get(d.target)?.y ?? 0)
      .attr("stroke", "#1e1e2e").attr("stroke-width", 1.5).attr("opacity", 0.6);

    const nodeGroups = g.selectAll("g.node")
      .data(positionedNodes).enter().append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer");

    nodeGroups.append("circle")
      .attr("r", 20).attr("fill", (d) => layerColors[d.layer])
      .attr("opacity", 0.15).attr("stroke", (d) => layerColors[d.layer]).attr("stroke-width", 1.5);

    nodeGroups.append("circle")
      .attr("r", 5).attr("fill", (d) => layerColors[d.layer]);

    nodeGroups.append("text")
      .attr("y", 34).attr("text-anchor", "middle")
      .attr("fill", "#e0e0e8").attr("font-size", 11)
      .text((d) => d.labelCn);

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
        select(this).select("circle").transition().duration(200).attr("r", 24);
      })
      .on("mouseleave", function () {
        setTooltip(null);
        select(this).select("circle").transition().duration(200).attr("r", 20);
      });
  }, []);

  useEffect(() => {
    render();
    const observer = new ResizeObserver(() => render());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [render]);

  return (
    <div ref={containerRef} className="relative rounded-xl border border-bg-border bg-bg-card p-4 overflow-hidden">
      <svg ref={svgRef} className="w-full" />
      {tooltip && (
        <div
          className="absolute z-10 rounded-lg border border-bg-border bg-bg p-3 text-sm shadow-xl pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
        >
          <p className="font-medium text-text">{tooltip.node.labelCn}</p>
          <p className="text-text-secondary text-xs">{tooltip.node.label}</p>
        </div>
      )}
    </div>
  );
}
