// 合并采集数据到 data/players.js
// 用法：node tools/合并选手更新.mjs  <采集json路径> ...（可多个，后面的优先级更高）
// 规则：①只填充缺失字段（dpi/sens/准星/外设） ②"changed"清单按站上新值覆盖
//       ③不匹配的选手进报告，不动 ④改前自动备份原文件
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url))) + "/";
const src = readFileSync(ROOT + "data/players.js", "utf8");
const m = src.match(/const PLAYERS = (\[[\s\S]*\n\]);/);
if (!m) throw new Error("players.js 结构不符");
const players = eval(m[1]);
const byKey = new Map();   // 小写id 和 小写名 都做索引
for (const p of players) {
  byKey.set(p.id.toLowerCase(), p);
  if (p.name) byKey.set(p.name.toLowerCase(), p);
}

const find = (id, name, team) => {
  if (id && byKey.has(String(id).toLowerCase())) return byKey.get(String(id).toLowerCase());
  if (name) {
    const n = String(name).toLowerCase();
    if (byKey.has(n)) return byKey.get(n);
    // 同名多人时用战队消歧
    for (const p of players) if (p.name.toLowerCase() === n && (!team || p.team === team)) return p;
  }
  return null;
};

const FILL_FIELDS = ["dpi", "sens", "crosshairCode", "crosshairColor", "res", "aspect", "monitorRes", "mouse", "keyboard", "headset", "mousepad", "monitor"];
const report = { filled: [], updated: [], skipped: [] };

const applyFound = (rec, priority) => {
  const p = find(rec.id, rec.name, rec.team);
  if (!p) { report.skipped.push({ name: rec.name, team: rec.team, 原因: "项目里找不到匹配选手" }); return; }
  let touched = false;
  for (const f of FILL_FIELDS) {
    const v = rec[f];
    if (v === null || v === undefined || v === "") continue;
    if (p[f] === null || p[f] === undefined || p[f] === "") {
      p[f] = v; touched = true;
    } else if (priority === "high" && String(p[f]) !== String(v) && ["crosshairCode", "dpi", "sens"].includes(f)) {
      // 高优先级来源（valorantcrosshairdb 明确给出新值）：记为更新
      p._旧值 = p._旧值 || {};
      p._旧值[f] = p[f];
      p[f] = v; touched = true;
    }
  }
  if (touched && (p.dpi && p.sens && p.crosshairCode)) p.verified = true;
  if (touched && rec.source) p.source = rec.source;
  if (touched) report.filled.push(p.name + "（" + p.team + "）");
};

const applyChanged = (rec) => {
  const p = find(rec.id, rec.name, rec.team);
  if (!p) { report.skipped.push({ name: rec.name, 原因: "changed清单匹配不到选手" }); return; }
  const nv = rec.新值 || {};
  for (const f of Object.keys(nv)) {
    if (nv[f] !== null && nv[f] !== undefined && String(p[f]) !== String(nv[f])) {
      p._旧值 = p._旧值 || {};
      p._旧值[f] = p[f];
      p[f] = nv[f];
    }
  }
  if (rec.source) p.source = rec.source;
  report.updated.push(p.name + "（" + p.team + "）");
};

for (const file of process.argv.slice(2)) {
  const data = JSON.parse(readFileSync(file, "utf8"));
  const priority = file.includes("vcdb") ? "high" : "low";
  const arr = Array.isArray(data) ? data : data.found || [];
  for (const rec of arr) applyFound(rec, priority);
  if (data.changed) for (const rec of data.changed) applyChanged(rec);
}

// 旧值清出对象序列化
const oldValues = {};
for (const p of players) {
  if (p._旧值) { oldValues[p.name] = p._旧值; delete p._旧值; }
}

copyFileSync(ROOT + "data/players.js", ROOT + "data/players.js.bak");
const header = src.slice(0, src.indexOf("const PLAYERS"));
const body = "const PLAYERS = " + JSON.stringify(players, null, 1).replace(/\n/g, "\n") + ";\n";
writeFileSync(ROOT + "data/players.js", header + body);

console.log("=== 合并报告 ===");
console.log("填充/更新人数:", report.filled.length, "→", report.filled.slice(0, 20).join("、"));
console.log("站上新值覆盖:", report.updated.length, "→", report.updated.slice(0, 20).join("、"));
console.log("旧值已记录:", JSON.stringify(oldValues).slice(0, 600));
console.log("跳过:", report.skipped.length, "→", JSON.stringify(report.skipped).slice(0, 400));
console.log("备份: data/players.js.bak");
