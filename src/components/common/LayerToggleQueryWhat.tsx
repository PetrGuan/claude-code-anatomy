import LayerToggle from "./LayerToggle";

export default function LayerToggleQueryWhat() {
  return (
    <LayerToggle
      plain={
        <div>
          <p>查询管线就像一个<strong>餐厅的完整点餐流程</strong>。</p>
          <p className="mt-2">
            你（顾客）对服务员说了一句话 → 服务员把它翻译成厨房能懂的完整订单（加上你的过敏信息、座位号等）→
            厨房做菜（Claude 思考回答）→ 如果需要食材，派人去仓库取（调用工具）→
            取回食材后继续做菜 → 最终端上来（回复你）。
          </p>
          <p className="mt-2">整个过程是<strong>流式</strong>的 — 就像日料的 omakase，一道道上，不是一次端上所有菜。</p>
        </div>
      }
      technical={
        <div>
          <p>
            查询管线是 Claude Code 的核心循环，由 <code>query.ts</code> 中的 <code>submitMessage()</code>
            async generator 驱动。它管理完整的消息生命周期：输入标准化 → 系统提示构建 → API 流式请求 →
            工具调度执行 → 递归循环。
          </p>
          <p className="mt-2">
            关键文件：<code>QueryEngine.ts</code>（会话状态机，1,295 行）管理可变会话状态；
            <code>query.ts</code>（1,729 行）实现核心逻辑；<code>query/</code> 子目录包含配置、
            依赖注入、token 预算、停止钩子等模块。
          </p>
        </div>
      }
    />
  );
}
