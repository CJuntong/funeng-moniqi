// 赋能模拟器 · PostToolUse 钩子
// 触发条件：每次 Bash 工具调用后运行；仅当命令包含 git commit 时干活。
// 行为：①对 js/data/electron 全部 JS 做语法验证 ②验证通过且存在未推送提交 → 自动 git push
//      ③验证失败或推送失败 → 打印原因、不推送、不阻塞（exit 0）
"use strict";
const { readFileSync, readdirSync } = require("fs");
const { spawnSync } = require("child_process");

const ROOT = "D:/vibecoding/无畏契约辅助";
const log = (m) => { console.error("[存档钩子] " + m); };

// ---- 读入工具调用入参，非 git commit 直接退出 ----
let raw = "";
try { raw = readFileSync(0, "utf8"); } catch { process.exit(0); }
let cmd = "";
try {
  const payload = JSON.parse(raw);
  cmd = (payload.tool_input && payload.tool_input.command) || "";
} catch { process.exit(0); }
if (!/\bgit\b[\s\S]{0,80}?\bcommit\b/.test(cmd)) process.exit(0);

const run = (file, args) =>
  spawnSync(file, args, { cwd: ROOT, encoding: "utf8", timeout: 180000 });

// ---- 1. 语法验证：js/ data/ electron/ 全部 .js ----
const targets = [];
for (const dir of ["js", "data", "electron"]) {
  try {
    for (const f of readdirSync(ROOT + "/" + dir)) {
      if (f.endsWith(".js")) targets.push(dir + "/" + f);
    }
  } catch { /* 目录不存在则跳过 */ }
}
const bad = [];
for (const t of targets) {
  const r = run("node", ["--check", t]);
  if (r.status !== 0) bad.push(t);
}
if (bad.length) {
  log(`语法验证未通过（${bad.join("、")}），本次不推送，请先修复。`);
  process.exit(0);
}

// ---- 2. 有未推送的提交才推送 ----
const unpushed = run("git", ["log", "origin/main..main", "--oneline"]);
if (unpushed.status !== 0 || !String(unpushed.stdout || "").trim()) {
  log("语法验证通过；没有待推送的提交，跳过推送。");
  process.exit(0);
}

// ---- 3. 推送（线路已固定在本仓库 git 配置） ----
const push = run("git", ["push"]);
if (push.status === 0) {
  const head = run("git", ["log", "-1", "--format=%h %s"]);
  log(`语法验证通过，已推送到 GitHub ✓（${String(head.stdout || "").trim().slice(0, 60)}）`);
} else {
  const err = String(push.stderr || "").trim().split("\n").pop();
  log(`语法验证通过，但推送失败（网络波动）：${err ? err.slice(0, 80) : "未知原因"}。稍后重试 git push 即可，本地提交已安全。`);
}
process.exit(0);
