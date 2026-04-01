import LayerToggle from "./LayerToggle";

export default function LayerTogglePermissionBash() {
  return (
    <LayerToggle
      plain={
        <div>
          <p>
            当 Claude 想运行一个 Shell 命令时，系统不只是看命令的文字 — 它会像编译器一样<strong>把命令拆解成语法树（AST）</strong>。
          </p>
          <p className="mt-2">
            比如 <code>cat file.txt | grep secret &gt; output.txt</code>，系统会识别出：
            这是一个管道命令，读了一个文件，过滤内容，然后写入另一个文件。
            它会分析每个子命令的风险等级，检测是否有命令注入、路径穿越等安全隐患。
          </p>
        </div>
      }
      technical={
        <div>
          <p>
            <code>utils/bash/bashSecurity.ts</code> 使用 tree-sitter 将 Shell 命令解析为 AST。
            分析器识别：命令链（<code>&amp;&amp;</code>, <code>||</code>, <code>;</code>）、
            管道（<code>|</code>）、重定向（<code>&gt;</code>）、
            子 Shell（<code>$()</code>）、变量展开（<code>$VAR</code>）等结构。
          </p>
          <p className="mt-2">
            每个子命令都被评估：是否为只读操作、是否修改文件系统、是否有网络访问。
            路径验证器还会检查文件路径是否在允许的目录范围内。
          </p>
        </div>
      }
    />
  );
}
