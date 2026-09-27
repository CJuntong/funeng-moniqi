// ============================================================
// 抓取选手照片与战队标志（来源：vlr.gg 公开页面，图片CDN owcdn.net）
// 运行：node tools/抓取选手照片.mjs
// 输出：assets/战队标志/<队名>.png、assets/选手照片/<ID>.png、assets/照片映射.json
// ============================================================

import fs from "node:fs";
import path from "node:path";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

// 2026 VCT 中国联赛 12 队（vlr.gg 队伍ID已核实）
const TEAMS = [
  ["EDG", "edward-gaming", 1120],
  ["BLG", "bilibili-gaming", 12010],
  ["FPX", "funplus-phoenix", 11328],
  ["DRG", "dragon-ranger-gaming", 11981],
  ["NOVA", "nova-esports", 12064],
  ["TE", "trace-esports", 12685],
  ["JDG", "jd-gaming", 13576],
  ["XLG", "xi-lai-gaming", 13581],
  ["WOL", "wolves-esports", 13790],
  ["TEC", "titan-esports-club", 14137],
  ["AG", "all-gamers", 1119],
  ["TYLOO", "tyloo", 731],
];

const ROOT = path.resolve(import.meta.dirname, "..");
const LOGO_DIR = path.join(ROOT, "assets", "战队标志");
const PHOTO_DIR = path.join(ROOT, "assets", "选手照片");
fs.mkdirSync(LOGO_DIR, { recursive: true });
fs.mkdirSync(PHOTO_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getText(url) {
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

async function download(url, file) {
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

const mapping = { teams: {}, photos: [] };
const seenAlias = new Set();

for (const [code, slug, id] of TEAMS) {
  const url = `https://www.vlr.gg/team/${id}/${slug}`;
  try {
    const html = await getText(url);

    // 队伍标志：队头区域第一张 owcdn 图片
    const logoMatch =
      html.match(/team-header[\s\S]{0,900}?src="(\/\/owcdn\.net[^"]+)"/) ||
      html.match(/src="(\/\/owcdn\.net[^"]+\.png)"/);
    if (logoMatch) {
      const logoUrl = "https:" + logoMatch[1];
      const file = path.join(LOGO_DIR, `${code}.png`);
      try {
        await download(logoUrl, file);
        mapping.teams[code] = `assets/战队标志/${code}.png`;
        console.log(`✔ ${code} 队标已下载`);
      } catch (e) {
        console.log(`✖ ${code} 队标下载失败: ${e.message}`);
      }
    } else {
      console.log(`✖ ${code} 未找到队标地址`);
    }

    // 选手照片：按 /player/ 链接分段，各段取第一张 owcdn 图与别名
    const segs = html.split(/href="\/player\/\d+\/[a-z0-9-]+"/).slice(1);
    const teamPhotos = [];
    for (const seg of segs) {
      const img = seg.match(/src="(\/\/owcdn\.net[^"]+)"/)?.[1];
      const aliasRaw = seg.match(/team-roster-item-name-alias">([\s\S]*?)<\/div>/)?.[1];
      const alias = aliasRaw && aliasRaw.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      if (!img || !alias || seenAlias.has(alias)) continue;
      seenAlias.add(alias);
      const safe = alias.replace(/[\\/:*?"<>|]/g, "");
      const file = path.join(PHOTO_DIR, `${safe}.png`);
      try {
        await download("https:" + img, file);
        teamPhotos.push({ alias, file: `assets/选手照片/${safe}.png` });
        console.log(`  ✔ ${alias} 照片已下载`);
      } catch (e) {
        console.log(`  ✖ ${alias} 照片下载失败: ${e.message}`);
      }
    }
    mapping.photos.push(...teamPhotos);
    console.log(`== ${code} 完成，本队照片 ${teamPhotos.length} 张 ==`);
  } catch (e) {
    console.log(`✖ ${code} 队伍页获取失败: ${e.message}`);
  }
  await sleep(800); // 限速，避免请求过快
}

// 生成照片清单（供网页做大小写不敏感的文件名匹配）
fs.writeFileSync(
  path.join(ROOT, "data", "photos.js"),
  "// 选手照片文件清单（由 tools/抓取选手照片.mjs 生成，勿手改）\nconst PHOTOS = " + JSON.stringify(mapping.photos.map((p) => p.alias)) + ";\n"
);

fs.writeFileSync(path.join(ROOT, "assets", "照片映射.json"), JSON.stringify(mapping, null, 2));
console.log(`\n全部完成：队标 ${Object.keys(mapping.teams).length} 个，照片 ${mapping.photos.length} 张`);
