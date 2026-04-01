import LayerToggle from "./LayerToggle";

export default function LayerToggleScale() {
  return (
    <LayerToggle
      plain={
        <p>
          想象一本 1,000 页的技术书，每页 500 行代码 — 这就是 Claude Code 的体量。
          它用 TypeScript 编写，运行在 Bun 上（比 Node.js 更快的 JavaScript 运行时），
          用 React 画界面 — 不过不是画在浏览器里，而是画在你的终端里。
        </p>
      }
      technical={
        <div>
          <p>
            512,664 行 TypeScript/TSX 代码，分布在 1,902 个文件中。
            运行时为 Bun，终端 UI 基于 React + Ink（React 的终端渲染器），
            使用 Yoga 进行 Flexbox 布局计算。
          </p>
          <ul className="mt-2 text-sm space-y-1">
            <li>· 1,332 个 .ts 文件（逻辑、类型、工具）</li>
            <li>· 552 个 .tsx 文件（React 组件）</li>
            <li>· 18 个 .js 文件（配置、兼容层）</li>
          </ul>
        </div>
      }
    />
  );
}
