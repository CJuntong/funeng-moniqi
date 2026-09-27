// ============================================================
// 下载无畏契约地图背景图（来源：valorant-api.com 公开API，官方媒体资源）
// 运行：node tools/下载地图背景.mjs
// 输出：assets/地图/<中文名>.png、data/maps.js（地图清单）
// ============================================================

import fs from "node:fs";
import path from "node:path";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const ROOT = path.resolve(import.meta.dirname, "..");
const MAP_DIR = path.join(ROOT, "assets", "地图");
fs.mkdirSync(MAP_DIR, { recursive: true });

const res = await fetch("https://valorant-api.com/v1/maps?language=zh-CN", { headers: { "user-agent": UA } });
const { data } = await res.json();

const maps = [];
for (const m of data) {
  if (!m.splash || m.displayName.includes("训练场")) continue;   // 跳过训练场
  const name = m.displayName;
  const file = path.join(MAP_DIR, `${name}.png`);
  try {
    const r = await fetch(m.splash, { headers: { "user-agent": UA } });
    if (!r.ok) { console.log(`✖ ${name} HTTP ${r.status}`); continue; }
    fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
    maps.push(name);
    console.log(`✔ ${name}`);
  } catch (e) {
    console.log(`✖ ${name} ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 300));
}

fs.writeFileSync(
  path.join(ROOT, "data", "maps.js"),
  "// 地图背景清单（由 tools/下载地图背景.mjs 生成，勿手改）\nconst MAPS = " + JSON.stringify(maps) + ";\n"
);
console.log(`\n完成：${maps.length} 张地图背景`);
