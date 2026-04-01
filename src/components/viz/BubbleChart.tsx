import { useEffect, useRef, useState, useCallback } from "react";
import { select } from "d3-selection";
import { pack, hierarchy, type HierarchyCircularNode } from "d3-hierarchy";
import "d3-transition";
import { modules, moduleName, moduleDesc, type Module } from "../../data/modules";
import type { Locale } from "../../i18n/locales";

interface ModuleNode {
  children: Module[];
}

export default function BubbleChart({ locale = "en" as Locale }: { locale?: Locale }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Module | null>(null);

  const render = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 420;
    const svg = select(svgRef.current).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    const packer = pack<Module>()
      .size([width - 40, height - 40])
      .padding(6);

    const root = hierarchy<ModuleNode>({ children: modules })
      .sum((d) => ("lines" in d ? (d as unknown as Module).lines : 0));

    const packed = packer(root as ReturnType<typeof hierarchy<Module>>);

    const g = svg.append("g").attr("transform", "translate(20,20)");

    const leaves = packed.leaves() as HierarchyCircularNode<Module>[];

    const nodeGroups = g.selectAll("g")
      .data(leaves)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer");

    nodeGroups.append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => d.data.color)
      .attr("opacity", 0.2)
      .attr("stroke", (d) => d.data.color)
      .attr("stroke-width", 1.5);

    nodeGroups.filter((d) => d.r > 25)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .attr("fill", "#e0e0e8")
      .attr("font-size", (d) => Math.min(d.r / 3, 13))
      .text((d) => moduleName(d.data, locale));

    nodeGroups.filter((d) => d.r > 25)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .attr("fill", "#8888a0")
      .attr("font-size", (d) => Math.min(d.r / 4, 10))
      .text((d) => `${(d.data.lines / 1000).toFixed(0)}${locale === "zh" ? "K 行" : "K LOC"}`);

    nodeGroups
      .on("mouseenter", function (_, d) {
        setActive(d.data);
        select(this).select("circle").transition().duration(200).attr("opacity", 0.4);
      })
      .on("mouseleave", function () {
        setActive(null);
        select(this).select("circle").transition().duration(200).attr("opacity", 0.2);
      });
  }, [locale]);

  useEffect(() => {
    render();
    const observer = new ResizeObserver(() => render());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [render]);

  return (
    <div ref={containerRef} className="relative rounded-xl border border-bg-border bg-bg-card p-4">
      <svg ref={svgRef} className="w-full" />
      {active && (
        <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-bg/90 border border-bg-border p-4 backdrop-blur">
          <p className="font-semibold" style={{ color: active.color }}>
            {moduleName(active, locale)} ({locale === "zh" ? active.name : active.nameCn})
          </p>
          <p className="text-sm text-text-secondary mt-1">{moduleDesc(active, locale)}</p>
          <p className="text-xs text-text-secondary mt-2 font-mono">
            {active.files} 文件 · {active.lines.toLocaleString()} 行代码 · {active.path}
          </p>
        </div>
      )}
    </div>
  );
}
