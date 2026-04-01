import LayerToggle from "./LayerToggle";

export default function LayerToggleToolSystem() {
  return (
    <LayerToggle
      plain={
        <div>
          <p>想象 Claude 是一个<strong>装修工人</strong>，工具系统就是它的<strong>工具箱</strong>。</p>
          <p className="mt-2">
            当你说"帮我修复这个 bug"，Claude 不是凭空回答，而是打开工具箱：
            用搜索工具找到相关代码，用文件读取工具查看内容，用编辑工具修改代码，
            用 Bash 工具运行测试。它自己选择用哪个工具，用什么顺序。
          </p>
          <p className="mt-2">
            更聪明的是：同时可以搜索多个文件（并行），但修改文件必须一个一个来（串行），避免把事情搞乱。
          </p>
        </div>
      }
      technical={
        <p>
          工具系统由 <code>Tool.ts</code> 定义工具接口，<code>tools.ts</code> 注册所有工具，
          <code>services/tools/toolOrchestration.ts</code> 负责调度执行。
          每个工具定义 <code>inputSchema</code>（Zod）、<code>isReadOnly()</code>、
          <code>call()</code> 方法。工具调度器根据 <code>isReadOnly()</code> 将调用分为并行批次和串行批次。
        </p>
      }
    />
  );
}
