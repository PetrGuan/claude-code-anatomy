import LayerToggle from "./LayerToggle";

export default function LayerTogglePermissionWhat() {
  return (
    <LayerToggle
      plain={
        <div>
          <p>
            Claude Code 能执行命令、修改文件、访问网络。这很强大，但也意味着它可能做出危险操作。
            权限系统就是它的<strong>安全锁</strong> — 确保每一个操作都经过审核。
          </p>
          <p className="mt-2">就像<strong>机场安检的三道关卡</strong>：</p>
          <ul className="mt-2 space-y-1">
            <li>🔬 <strong>X 光机（ML 分类器）</strong> — 自动扫描，快速放行安全物品，拦截明显危险品</li>
            <li>👮 <strong>安检员（规则引擎）</strong> — 按规章制度（你的自定义规则）逐条检查</li>
            <li>✋ <strong>旅客确认（用户对话框）</strong> — 不确定的情况下让你自己决定</li>
          </ul>
        </div>
      }
      technical={
        <p>
          权限系统分三层：(1) ML 分类器（<code>bashClassifier.ts</code> / <code>yoloClassifier.ts</code>）
          使用训练好的模型判断操作安全性；(2) 规则引擎（<code>shellRuleMatching.ts</code>）
          匹配用户定义的 allow/deny 规则；(3) REPL 中的用户确认对话框。
          <code>utils/permissions/</code> 包含 23 个文件，
          <code>utils/bash/</code> 用 tree-sitter 做 Shell 命令 AST 解析。
        </p>
      }
    />
  );
}
