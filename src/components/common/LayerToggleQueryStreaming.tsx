import LayerToggle from "./LayerToggle";

export default function LayerToggleQueryStreaming() {
  return (
    <LayerToggle
      plain={
        <p>
          想象水龙头和水桶的区别。传统方式是等水桶装满了再端过来（等完整回复），
          Claude Code 用的是水龙头模式 — 水一出来就流到你杯子里。技术上这叫 "async generator"，
          一种让数据像水流一样一点点传输的编程技巧。好处：响应快、内存小、随时可以关掉水龙头（取消操作）。
        </p>
      }
      technical={
        <p>
          所有数据流通过 <code>AsyncGenerator&lt;MessageUpdate&gt;</code> 传输。
          <code>submitMessage()</code> 是一个 async generator，每收到一个 API stream event 就 yield 一个 update。
          消费方用 <code>for await...of</code> 逐条处理，天然支持背压（backpressure）。
          取消通过 <code>AbortController</code> 实现。这个模式贯穿整个代码库。
        </p>
      }
    />
  );
}
