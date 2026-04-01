import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { modules, type Module } from "../../data/modules";

export default function BubbleChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Module | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 420;
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    const pack = d3.pack<Module>()
      .size([width - 40, height - 40])
      .padding(6);

    const root = d3.hierarchy({ children: modules } as any)
      .sum((d: any) => d.lines || 0);

    const packed = pack(root as any);

    const g = svg.append("g").attr("transform", "translate(20,20)");

    const nodeGroups = g.selectAll("g")
      .data(packed.leaves())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer");

    nodeGroups.append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d: any) => d.data.color)
      .attr("opacity", 0.2)
      .attr("stroke", (d: any) => d.data.color)
      .attr("stroke-width", 1.5);

    nodeGroups.filter((d) => d.r > 25)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .attr("fill", "#e0e0e8")
      .attr("font-size", (d) => Math.min(d.r / 3, 13))
      .text((d: any) => d.data.nameCn);

    nodeGroups.filter((d) => d.r > 25)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .attr("fill", "#8888a0")
      .attr("font-size", (d) => Math.min(d.r / 4, 10))
      .text((d: any) => `${(d.data.lines / 1000).toFixed(0)}K 行`);

    nodeGroups
      .on("mouseenter", function (_, d: any) {
        setActive(d.data);
        d3.select(this).select("circle").transition().duration(200).attr("opacity", 0.4);
      })
      .on("mouseleave", function () {
        setActive(null);
        d3.select(this).select("circle").transition().duration(200).attr("opacity", 0.2);
      });
  }, []);

  return (
    <div ref={containerRef} className="relative rounded-xl border border-bg-border bg-bg-card p-4">
      <svg ref={svgRef} className="w-full" />
      {active && (
        <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-bg/90 border border-bg-border p-4 backdrop-blur">
          <p className="font-semibold" style={{ color: active.color }}>
            {active.nameCn} ({active.name})
          </p>
          <p className="text-sm text-text-secondary mt-1">{active.descriptionCn}</p>
          <p className="text-xs text-text-secondary mt-2 font-mono">
            {active.files} 文件 · {active.lines.toLocaleString()} 行代码 · {active.path}
          </p>
        </div>
      )}
    </div>
  );
}
