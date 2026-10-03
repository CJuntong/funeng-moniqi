// ============================================================
// 无畏契约辅助 · 网页原型逻辑
// 功能：列表渲染 / 多条件筛选 / 搜索 / 详情弹窗 / 准星复制 / 收藏
// ============================================================

const $ = (sel) => document.querySelector(sel);

// 灵敏度分档阈值（与 Zcode.md 3.1 约定一致，M2 数据核实阶段校准）
const TIER_RULES = [
  { key: "低速", max: 250 },
  { key: "中速", max: 400 },
  { key: "高速", max: Infinity },
];

// 准星颜色 → 色点颜色
const CROSS_COLORS = {
  "青": "#00e5d0", "绿": "#7cf53c", "白": "#f5f7fa",
  "红": "#ff4655", "粉": "#ff7ab8", "黄": "#ffe24a",
  "紫": "#d6a3ff", "黑": "#8b939c",
};

const REGIONS = ["中国", "美洲", "EMEA", "太平洋"];

const state = { search: "", view: "players", region: "", team: "", role: "", tier: "", color: "", pcolor: "", favOnly: false };

// ---------- 可视化头像 ----------
// 统一风格：队伍主题色渐变 + 选手照片（如有）+ 战队标志背景水印（如有）+ 首字母兜底
const TEAM_COLORS = {
  EDG: ["#ff4655", "#6e1620"], TE: ["#f7c948", "#6b5310"], BLG: ["#4da6ff", "#123a66"],
  FPX: ["#ff6a3d", "#6e2413"], WOL: ["#9fb3c2", "#2b3d4f"], DRG: ["#ffb14d", "#6e4a10"],
  AG: ["#35d0a5", "#0d4a3a"], TEC: ["#b58cff", "#3a2466"], JDG: ["#ff5c5c", "#661a1a"],
  TYLOO: ["#ff8566", "#66291a"], XLG: ["#5ee0ff", "#0e4a5a"], NOVA: ["#ffd166", "#5a4712"],
  自由人: ["#9aa7b1", "#39434c"],
  虎牙: ["#ffa51f", "#7a4a10"], 斗鱼: ["#ff5d23", "#6e250e"], 抖音: ["#25f4ee", "#0e2a2b"],
  B站: ["#fb7299", "#6d1f35"], 快手: ["#ff7e12", "#6e3a08"],
  常用: ["#4da6ff", "#123a66"], 娱乐: ["#ff77aa", "#5a1a33"], 可爱: ["#ffb8db", "#5a2440"],
  FNC: ["#ff5900", "#5a2400"], PRX: ["#ff4d88", "#5a1a33"], SEN: ["#ff4655", "#661a1a"],
  DRX: ["#4da6ff", "#123a66"], GEN: ["#e8c35a", "#4a3c12"],
};

// 照片文件名大小写不敏感匹配（vlr 别名大小写与显示名可能不同）
const PHOTO_FILE = {};
(typeof PHOTOS !== "undefined" ? PHOTOS : []).forEach((a) => { PHOTO_FILE[a.toLowerCase()] = a; });

// 主播条目补齐通用字段（platform 即所属平台，映射到 team 供卡片/筛选复用）
(typeof STREAMERS !== "undefined" ? STREAMERS : []).forEach((s) => {
  s.team = s.platform;
  s.teamFull = `${s.platform}主播`;
  s.region = s.region ?? "中国";
  s.verified = s.verified ?? true;
});

// 准星预设补齐通用字段，复用卡片头像 / 收藏 / 详情机制
(typeof PRESETS !== "undefined" ? PRESETS : []).forEach((p) => {
  p.preset = true;
  p.team = p.cat;
  p.teamFull = `${p.cat}准星`;
  p.region = "通用";
  p.verified = true;
});

function hashStr(s) {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.codePointAt(0)) | 0;
  return Math.abs(h);
}

function avatarHtml(p, big = false) {
  const [c1, c2] = TEAM_COLORS[p.team] || ["#3d5871", "#16222e"];
  const angle = 105 + (hashStr(p.id || p.name) % 5) * 14;   // 同队不同选手，纹理角度略有差异
  // 准星预设：头像区直接放大号准星预览（更直观，也避免中文首字母重复感）
  if (p.preset) {
    return `
    <div class="card-avatar${big ? " big" : ""} preset" style="background:linear-gradient(${angle}deg, ${c1}, ${c2})">
      <span class="avatar-pattern"></span>
      <span class="ch-box avatar-ch" style="width:${big ? 96 : 72}px;height:${big ? 96 : 72}px;color:${chColorOf(p)}">${crosshairParts(p, big ? 96 : 72, 3)}</span>
      <span class="avatar-team">${p.team}</span>
    </div>`;
  }
  const initials = (p.name.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 2) || "??").toUpperCase();
  const photoAlias = PHOTO_FILE[p.name.toLowerCase()];
  const photo = photoAlias
    ? `<img class="avatar-photo" src="assets/选手照片/${photoAlias}.png" alt="${p.name}" onerror="this.remove()">`
    : "";
  const logo = `<img class="avatar-logo" src="assets/战队标志/${p.team}.png" alt="" onerror="this.remove()">`;
  return `
    <div class="card-avatar${big ? " big" : ""}" style="background:linear-gradient(${angle}deg, ${c1}, ${c2})">
      ${logo}
      <span class="avatar-ghost">${initials[0]}</span>
      <span class="avatar-pattern"></span>
      <span class="avatar-initials">${initials}</span>
      ${photo}
      <span class="avatar-team">${p.team}</span>
    </div>`;
}

// ---------- 计算字段 ----------
const edpiRaw = (p) => p.dpi * p.sens;
const edpiOf = (p) => Number(edpiRaw(p).toFixed(1));   // 去掉浮点长尾，如 231.99999… → 232
const cm360Of = (p) => (2.54 * 360 / (0.07 * edpiRaw(p))).toFixed(1);
const tierOf = (p) => {
  const e = edpiRaw(p);
  return (TIER_RULES.find((t) => e <= t.max) || TIER_RULES[TIER_RULES.length - 1]).key;
};

// 显示器原生分辨率 → 通俗叫法（按用户要求：界面不显示刷新率，改显示分辨率档位）
function monitorTierOf(p) {
  if (!p.monitorRes) return null;
  const [w, h] = p.monitorRes.split("×").map(Number);
  if (w >= 3840 || h >= 2160) return "4K";
  if (w >= 2560 || h >= 1440) return "2K";
  if (w >= 1920 || h >= 1080) return "1080P";
  return p.monitorRes;
}

// ---------- 准星可视化渲染（借鉴 valorantcrosshairdb：按代码参数画出准星真实样子） ----------
const CH_GAME_COLORS = { 0: "#f5f7fa", 1: "#7cf53c", 2: "#b7f34a", 3: "#ffe24a", 4: "#00e5d0", 5: "#ff7ab8", 6: "#ff8a4d", 7: "#ff4655", 8: "#f5f7fa" };

function parseCross(code) {
  const o = {};
  if (typeof code !== "string") return o;
  const t = code.split(";");
  for (let i = 0; i + 1 < t.length; i += 2) o[t[i]] = t[i + 1];
  return o;
}

function chColorOf(p) {
  // 优先采用来源网站标注的颜色（与该站预览一致）；其次支持代码里的自定义颜色 u 参数；再按代码颜色编号推断
  if (p.crosshairColor && CROSS_COLORS[p.crosshairColor]) return CROSS_COLORS[p.crosshairColor];
  const kv = parseCross(p.crosshairCode);
  if (kv.u && /^[0-9a-fA-F]{8}$/.test(kv.u)) return "#" + kv.u.slice(0, 6);
  if (kv.c !== undefined && CH_GAME_COLORS[+kv.c]) return CH_GAME_COLORS[+kv.c];
  return "#f5f7fa";
}

// 把准星代码画成图形；size=预览盒边长(px)
// k=每个代码单位的像素数：以 valorantcrosshairdb 的渲染为基准校准（S1Mon 总跨度8单位→5px，即0.625px/单位）
function crosshairParts(p, size, k = 0.625) {
  if (!p.crosshairCode) return "";
  const kv = parseCross(p.crosshairCode);
  const num = (key, d) => { const v = parseFloat(kv[key]); return Number.isFinite(v) ? v : d; };
  const half = size / 2;
  const parts = [];
  const dot = kv.d === "1";
  const z = Math.min(num("z", 1) * k, half);
  const iT = Math.max(1.5, num("0t", 1) * k * 0.8);
  const iL = Math.min(num("0l", 0) * k, half - 2);
  const iO = Math.min(num("0o", 1) * k + (dot ? z / 2 : 0), half - 2);
  const oL = Math.min(num("1l", 0) * k, half - 2);
  const oO = Math.min(num("1o", 0) * k + iO + iL, half - 2);
  const oT = Math.max(1.5, num("1t", 1) * k * 0.8);
  const line = (l, t, w, h) => parts.push(`<i class="ch-l" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px"></i>`);
  if (iL > 0) {
    line(half - iT / 2, half - iO - iL, iT, iL);   // 内·上
    line(half - iT / 2, half + iO, iT, iL);        // 内·下
    line(half - iO - iL, half - iT / 2, iL, iT);   // 内·左
    line(half + iO, half - iT / 2, iL, iT);        // 内·右
  }
  if (oL > 0) {
    line(half - oT / 2, half - oO - oL, oT, oL);   // 外·上
    line(half - oT / 2, half + oO, oT, oL);        // 外·下
    line(half - oO - oL, half - oT / 2, oL, oT);   // 外·左
    line(half + oO, half - oT / 2, oL, oT);        // 外·右
  }
  if (dot) line(half - z / 2, half - z / 2, z, z);
  if (!parts.length) line(half - iT / 2, half - iT / 2, iT, iT);   // 无参数时退化为中心点
  return parts.join("");
}

const chBox = (p, size) =>
  `<span class="ch-box" style="width:${size}px;height:${size}px;color:${chColorOf(p)}">${crosshairParts(p, size)}</span>`;

// 卡片第三行：准星预览 + 屏幕分辨率档位
const crossLine = (p) => {
  const c = p.crosshairColor ?? "待核实";
  const m = monitorTierOf(p);
  return `${p.crosshairCode ? chBox(p, 20) : ""} 准星 ${c} · ${m ? m + "屏" : "屏幕待核实"}`;
};

// ---------- 收藏（保存在本机浏览器） ----------
const FAV_KEY = "valorant-assistant-favorites";
const loadFavs = () => { try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch { return []; } };
const saveFavs = (list) => localStorage.setItem(FAV_KEY, JSON.stringify(list));
const isFav = (id) => loadFavs().includes(id);
function toggleFav(id) {
  const list = loadFavs();
  const i = list.indexOf(id);
  if (i >= 0) { list.splice(i, 1); toast("已取消收藏"); } else { list.push(id); toast("已加入收藏"); }
  saveFavs(list);
  renderGrid();
  renderFavButton();
}

// ---------- 多人对比（最多同时 4 人，选择保存在本机浏览器） ----------
const CMP_KEY = "valorant-assistant-compare";
const loadCmp = () => { try { return JSON.parse(localStorage.getItem(CMP_KEY)) || []; } catch { return []; } };
const saveCmp = (list) => localStorage.setItem(CMP_KEY, JSON.stringify(list));
const isInCmp = (id) => loadCmp().includes(id);
const cmpFind = (id) => PLAYERS.find((x) => x.id === id) || STREAMERS.find((x) => x.id === id);
function toggleCmp(id) {
  const list = loadCmp();
  const i = list.indexOf(id);
  if (i >= 0) { list.splice(i, 1); toast("已移出对比栏"); }
  else {
    if (list.length >= 4) { toast("最多同时对比 4 位，先移除一位吧"); return; }
    list.push(id);
    toast(list.length >= 2 ? "已加入对比栏，点右下角「开始对比」" : "已加入对比栏，再选 1~3 位即可对比");
  }
  saveCmp(list);
  renderGrid();
  renderCmpTray();
}

// ---------- 筛选 ----------
function filteredPlayers() {
  const q = state.search.trim().toLowerCase();
  return PLAYERS.filter((p) => {
    if (state.region && p.region !== state.region) return false;
    if (state.team && p.team !== state.team) return false;
    if (state.role && p.role !== state.role) return false;
    if (state.tier && tierOf(p) !== state.tier) return false;
    if (state.color && p.crosshairColor !== state.color) return false;
    if (state.favOnly && !isFav(p.id)) return false;
    if (q && !`${p.name} ${p.team} ${p.teamFull} ${p.role}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

// ---------- 下拉选项初始化 ----------
function initSelects() {
  const fill = (sel, items) => {
    for (const { value, label } of items) {
      const opt = document.createElement("option");
      opt.value = value; opt.textContent = label;
      sel.appendChild(opt);
    }
  };
  fill($("#f-region"), REGIONS.map((r) => ({ value: r, label: `赛区：${r}` })));

  const teams = [...new Map(PLAYERS.map((p) => [p.team, p])).values()];
  fill($("#f-team"), teams.map((p) => ({ value: p.team, label: `战队：${p.team} · ${p.teamFull}` })));

  const roles = [...new Set(PLAYERS.map((p) => p.role).filter(Boolean))];
  fill($("#f-role"), roles.map((r) => ({ value: r, label: `位置：${r}` })));

  fill($("#f-tier"), TIER_RULES.map((t) => ({ value: t.key, label: `灵敏度：${t.key}` })));
  fill($("#f-color"), Object.keys(CROSS_COLORS).map((c) => ({ value: c, label: `准星颜色：${c}` })));
}

// ---------- 卡片渲染 ----------
function cardHtml(p) {
  if (p.id.startsWith("w-")) return weaponCardHtml(p);
  if (p.id.startsWith("lu-")) return lineupCardHtml(p);
  if (p.preset) return presetCardHtml(p);
  return `
    <article class="card" data-id="${p.id}">
      ${avatarHtml(p)}
      <button class="card-star ${isFav(p.id) ? "on" : ""}" data-star="${p.id}"
              title="收藏" aria-label="收藏">${isFav(p.id) ? "★" : "☆"}</button>
      <button class="card-cmp ${isInCmp(p.id) ? "on" : ""}" data-cmp="${p.id}"
              title="加入/移出多人对比" aria-label="对比">⚖</button>
      <div class="card-body">
      <div class="card-head">
        <span class="card-name">${p.name}</span>
        <span class="card-role">${p.role ?? "待核实"}</span>
      </div>
      <div class="card-team"><b>${p.team}</b> · ${p.teamFull} · ${p.region}</div>
      <div class="card-stats">
        <span>${p.dpi && p.sens ? `eDPI <b>${edpiOf(p)}</b>（${tierOf(p)}）` : "eDPI 待核实"}</span>
        <span>${p.dpi && p.sens ? `DPI ${p.dpi} × 灵敏度 ${p.sens} · 360°约 <b>${cm360Of(p)}cm</b>` : "灵敏度设置待核实"}</span>
        <span>${crossLine(p)}</span>
      </div>
      </div>
    </article>
  `;
}

// 准星预设卡片（常用/娱乐）：无 DPI/外设等字段，突出准星样式本身
function presetCardHtml(p) {
  return `
    <article class="card" data-id="${p.id}">
      ${avatarHtml(p)}
      <button class="card-star ${isFav(p.id) ? "on" : ""}" data-star="${p.id}"
              title="收藏" aria-label="收藏">${isFav(p.id) ? "★" : "☆"}</button>
      <div class="card-body">
      <div class="card-head">
        <span class="card-name">${p.name}</span>
        <span class="card-role">${p.cat}样式</span>
      </div>
      <div class="card-team"><b>${p.team}</b> · 瓦境精选</div>
      <div class="card-stats">
        <span>${chBox(p, 20)} 准星 ${p.crosshairColor}</span>
        <span>点击卡片查看地图效果 · 一键复制</span>
      </div>
      </div>
    </article>
  `;
}

function renderGrid() {
  const isSt = state.view === "streamers";
  const isPre = state.view === "common" || state.view === "fun";
  const isW = state.view === "weapons";
  const isL = state.view === "lineups";
  let list, countText, emptyText;
  if (isSt) {
    list = streamerList();
    countText = `共 <b>${list.length}</b> 位主播`;
    emptyText = "主播热门准星数据采集中，敬请期待…";
  } else if (isPre) {
    list = presetList();
    countText = `共 <b>${list.length}</b> 个准星`;
    emptyText = "没有符合条件的准星，试试换个颜色。";
  } else if (state.view === "weapons") {
    list = weaponList();
    countText = `共 <b>${list.length}</b> 把武器`;
    emptyText = "没有找到武器，试试换个关键词。";
  } else if (state.view === "lineups") {
    list = lineupList();
    countText = `共 <b>${list.length}</b> 条点位/技巧`;
    emptyText = "该地图暂无收录，试试其他地图或清空筛选。";
  } else {
    list = filteredPlayers();
    countText = `共 <b>${list.length}</b> 名选手`;
    emptyText = "没有符合条件的选手，试试放宽筛选条件。";
  }
  $("#count").innerHTML = countText;
  $("#empty").textContent = emptyText;
  $("#empty").hidden = list.length > 0;
  $("#grid").classList.toggle("grouped", isW || isL);
  if (isW) {
    $("#grid").innerHTML = renderGrouped(list, (w) => w.type, WEAPON_TYPE_ORDER);
  } else if (isL) {
    // 点位：地图大组 → 组内按 英雄职责层 排序（英雄优先，通用垫后）
    $("#grid").innerHTML = renderGrouped(list, (l) => l.map, null, (a, b) => {
      const ra = a.agent ? ROLE_ORDER.indexOf(roleOf(a.agent)) : 99;
      const rb = b.agent ? ROLE_ORDER.indexOf(roleOf(b.agent)) : 99;
      return ra - rb || (a.agent || "").localeCompare(b.agent || "");
    });
  } else {
    $("#grid").innerHTML = list.map(cardHtml).join("");
  }
  renderChips();
}

const WEAPON_TYPE_ORDER = ["手枪", "冲锋枪", "霰弹枪", "步枪", "狙击枪", "机关枪", "近战"];
const AGENT_ROLES = {
  "幽影": "控场者", "星礈": "控场者", "海神": "控场者", "蝰蛇": "控场者", "蝮蛇": "控场者",
  "猎枭": "先锋", "铁臂": "先锋", "KAY/O": "先锋", "溃影": "先锋", "黑梦": "先锋",
  "菲尼克斯": "决斗者", "芮娜": "决斗者", "捷风": "决斗者", "雷兹": "决斗者", "霓虹": "决斗者", "尤朵拉": "决斗者",
  "贤者": "守卫者", "奇乐": "守卫者", "钢锁": "守卫者", "零": "守卫者", "天后": "控场者",
};
const ROLE_ORDER = ["控场者", "先锋", "决斗者", "守卫者"];
const roleOf = (agent) => (agent && AGENT_ROLES[agent]) || null;

function renderGrouped(list, groupFn, order, itemSort) {
  const groups = [];
  for (const item of list) {
    const k = groupFn(item);
    let g = groups.find((x) => x.key === k);
    if (!g) { g = { key: k, items: [] }; groups.push(g); }
    g.items.push(item);
  }
  if (order) groups.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
  if (itemSort) groups.forEach((g) => g.items.sort(itemSort));
  return groups.map((g) => `
    <h3 class="group-head">${g.key}<i>${g.items.length} 项</i></h3>
    <div class="grid">${g.items.map(cardHtml).join("")}</div>`).join("");
}

// ---------- 武器节奏视图 ----------
// ---------- 武器节奏视图 ----------
function weaponList() {
  const q = state.search.trim().toLowerCase();
  return WEAPONS.filter((w) => !q || (w.name + " " + w.en + " " + w.type).toLowerCase().includes(q));
}

function lineupList() {
  const q = state.search.trim().toLowerCase();
  return LINEUPS.filter((l) => {
    if (state.pcolor && l.map !== state.pcolor) return false;
    if (q && !(l.title + " " + l.map + " " + (l.agent || "") + " " + l.type + " " + l.desc).toLowerCase().includes(q)) return false;
    return true;
  });
}

// 弹道示意图（自制原创绘制）：弹着点连线 + 起始准星参考
function spraySvg(w, size) {
  const pts = w.pattern;
  const pad = 12;
  const X = (x) => (pad + (x + 16) * ((size - pad * 2) / 32)).toFixed(1);
  const Y = (y) => (pad + (y + 26) * ((size - pad * 2) / 32)).toFixed(1);
  const path = pts.map((p, i) => (i ? "L" : "M") + X(p[0]) + "," + Y(p[1])).join(" ");
  const dots = pts.map((p, i) =>
    `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="${i === 0 ? 3 : 2}" fill="${i < 4 ? "#f5f7fa" : i < 12 ? "#7cf53c" : "#ff7ab8"}" opacity="0.95"/>`).join("");
  const ch = `<line x1="${X(0) - 6}" y1="${Y(0)}" x2="${X(0) + 6}" y2="${Y(0)}" stroke="#00e5d0" stroke-width="1"/>
    <line x1="${X(0)}" y1="${Y(0) - 6}" x2="${X(0)}" y2="${Y(0) + 6}" stroke="#00e5d0" stroke-width="1"/>`;
  return `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%">
    <path d="${path}" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>
    ${dots}${ch}
    <text x="${X(0)}" y="${Number(Y(0)) + 16}" fill="#8b939c" font-size="10" text-anchor="middle">▲ 起始弹着点（前 4 发白色）</text>
  </svg>`;
}

function weaponCardHtml(w) {
  return `
    <article class="card" data-id="${w.id}">
      <div class="card-avatar weapon-av"><span class="weapon-en">${w.en}</span></div>
      <div class="card-body">
      <div class="card-head">
        <span class="card-name">${w.name}</span>
        <span class="card-role">${w.type}</span>
      </div>
      <div class="card-team"><b>${w.price === 0 ? "免费" : w.price + " 信用点"}</b> · ${w.en}</div>
      <div class="card-stats">
        <span>弹匣 <b>${w.mag}</b> 发 · ${w.mode}</span>
        <span>${w.cadence[0].range}</span>
      </div>
      </div>
    </article>
  `;
}

function lineupCardHtml(l) {
  const vids = (typeof LINEUP_VIDEOS !== "undefined" ? LINEUP_VIDEOS : []).filter((v) => v.map === l.map).length;
  const vid = vids ? `<span style="color:#7cf53c">🎬 教学视频 ×${vids}</span>` : `<span>视频整理中</span>`;
  return `
    <article class="card" data-id="${l.id}">
      <div class="card-avatar lineup-av"><span class="lu-map">${l.map}</span></div>
      <div class="card-body">
      <div class="card-head">
        <span class="card-name">${l.title.length > 13 ? l.title.slice(0, 13) + "…" : l.title}</span>
        <span class="card-role">${l.type}</span>
      </div>
      <div class="card-team"><b>${l.map}</b>${l.agent ? ` · ${l.agent}（${roleOf(l.agent)}）` : " · 通用"}</div>
      <div class="card-stats">
        <span>${vid}</span>
        <span>${l.desc.slice(0, 24)}…</span>
      </div>
      </div>
    </article>
  `;
}

// ---------- 准星预设视图（常用 / 娱乐） ----------
function presetList() {
  const cats = state.view === "common" ? ["常用"] : ["娱乐", "可爱"];
  const q = state.search.trim().toLowerCase();
  return PRESETS.filter((s) => {
    if (!cats.includes(s.cat)) return false;
    if (state.pcolor && s.crosshairColor !== state.pcolor) return false;
    if (q && !`${s.name} ${s.cat}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

// 智慧快筛：预设视图按颜色、点位视图按地图一键过滤
function renderChips() {
  const box = $("#chips");
  if (state.view === "lineups") {
    const maps = [...new Set(LINEUPS.map((l) => l.map))];
    box.innerHTML =
      `<button class="chip ${state.pcolor ? "" : "on"}" data-chip="" type="button">全部地图</button>` +
      maps.map((m) => `<button class="chip ${state.pcolor === m ? "on" : ""}" data-chip="${m}" type="button">${m}</button>`).join("");
    box.hidden = false;
    return;
  }
  if (state.view !== "common" && state.view !== "fun") { box.hidden = true; return; }
  const cats = state.view === "common" ? ["常用"] : ["娱乐", "可爱"];
  const colors = [...new Set(PRESETS.filter((s) => cats.includes(s.cat)).map((s) => s.crosshairColor))];
  box.innerHTML =
    `<button class="chip ${state.pcolor ? "" : "on"}" data-chip="" type="button">全部</button>` +
    colors.map((c) =>
      `<button class="chip ${state.pcolor === c ? "on" : ""}" data-chip="${c}" type="button">
        <i style="background:${CROSS_COLORS[c] || "#ccc"}"></i>${c}</button>`).join("");
  box.hidden = false;
}

// ---------- 主播视图 ----------
function streamerList() {
  const q = state.search.trim().toLowerCase();
  return STREAMERS.filter((s) => !q || `${s.name} ${s.team}`.toLowerCase().includes(q));
}

function setView(view) {
  state.view = view;
  state.pcolor = "";
  document.querySelectorAll(".nav-links a").forEach((a) => a.classList.toggle("active", a.dataset.view === view));
  ["f-region", "f-team", "f-role", "f-tier", "f-color"].forEach((id) => { $(`#${id}`).style.display = view === "players" ? "" : "none"; });
  renderGrid();
}

// ---------- 多人对比：底部悬浮栏 + 对比弹窗 ----------
function renderCmpTray() {
  const tray = $("#cmp-tray");
  const list = loadCmp().map(cmpFind).filter(Boolean);
  if (!list.length) { tray.hidden = true; tray.innerHTML = ""; return; }
  tray.hidden = false;
  tray.innerHTML = `
    <span class="ct-label">对比栏 ${list.length}/4：</span>
    ${list.map((p) => `<span class="ct-chip" data-cmp-remove="${p.id}" title="移出对比栏">${p.name} ✕</span>`).join("")}
    <button class="copy-btn ct-go" data-cmp-open type="button" ${list.length < 2 ? "disabled title=\"至少选择 2 位\"" : ""}>⚖ 开始对比</button>
    <button class="ct-clear" data-cmp-clear type="button">清空</button>`;
}

function cmpFaceHtml(p) {
  const alias = PHOTO_FILE[p.name.toLowerCase()];
  if (alias) return `<img class="cmp-face" src="assets/选手照片/${alias}.png" alt="${p.name}" onerror="this.outerHTML='<span class=\\'cmp-face ghost\\'>${p.name.slice(0, 2)}</span>'">`;
  return `<span class="cmp-face ghost">${p.name.slice(0, 2)}</span>`;
}

function openCmpModal() {
  const list = loadCmp().map(cmpFind).filter(Boolean);
  $("#modal-body").dataset.pid = "";
  const pickRow = list.length < 4 ? `
    <div class="cmp-pick">
      <select id="cmp-select">
        <option value="">＋ 添加选手 / 主播到对比栏…</option>
        ${[...PLAYERS, ...STREAMERS].filter((p) => !loadCmp().includes(p.id))
          .map((p) => `<option value="${p.id}">${p.name}（${p.team}${p.dpi && p.sens ? " · eDPI " + edpiOf(p) : ""}）</option>`).join("")}
      </select>
    </div>` : "";

  if (!list.length) {
    $("#modal-body").innerHTML = `
      <div class="d-head"><h2>多人对比</h2></div>
      <p class="d-sub">选择 2~4 位选手 / 主播，并排比较灵敏度、准星与外设</p>
      <p class="d-note">两种加人方式：① 在「选手库」卡片右上角点 <b>⚖</b>；② 在下面的下拉框直接选：</p>
      ${pickRow}
      <div class="d-section">
        <h3>对比内容</h3>
        <p class="d-import">DPI / 灵敏度 / eDPI / 360° 转身距离逐项并排，eDPI 还会标在同一条刻度上；准星代码可逐个复制；最后有「同屏准星对比」——四颗准星按真实大小摆在同一张实战背景上。</p>
      </div>`;
  } else {
    const withEdpi = list.filter((p) => p.dpi && p.sens);
    const min = withEdpi.length ? Math.min(...withEdpi.map(edpiOf)) : 0;
    const max = withEdpi.length ? Math.max(...withEdpi.map(edpiOf)) : 1;
    const pos = (v) => max > min ? Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100)) : 50;
    const row = (label, fn) => `<tr><th>${label}</th>${list.map((p) => `<td>${fn(p)}</td>`).join("")}</tr>`;
    $("#modal-body").innerHTML = `
      <div class="d-head"><h2>多人对比（${list.length}/4）</h2></div>
      ${pickRow}
      <div class="cmp-scroll">
        <table class="cmp-table">
          ${row("照片", (p) => cmpFaceHtml(p))}
          ${row("名字", (p) => `<b>${p.name}</b>`)}
          ${row("队伍", (p) => `${p.team} · ${p.teamFull}`)}
          ${row("鼠标 DPI", (p) => p.dpi ?? "待核实")}
          ${row("游戏内灵敏度", (p) => p.sens ?? "待核实")}
          ${row("eDPI", (p) => p.dpi && p.sens ? `<b>${edpiOf(p)}</b>（${tierOf(p)}）` : "待核实")}
          ${withEdpi.length ? `<tr><th>eDPI 刻度</th>${list.map((p) => p.dpi && p.sens
            ? `<td><span class="cmp-track"><i class="cmp-dot" style="left:${pos(edpiOf(p))}%"></i></span></td>` : "<td>—</td>").join("")}</tr>` : ""}
          ${row("360°转身距离", (p) => p.dpi && p.sens ? `约 ${cm360Of(p)} cm` : "待核实")}
          ${row("准星样式", (p) => p.crosshairCode ? chBox(p, 56) : "待核实")}
          ${row("准星颜色", (p) => p.crosshairColor ?? "待核实")}
          ${row("准星代码", (p) => p.crosshairCode
            ? `<span class="cmp-code">${p.crosshairCode}</span><button class="copy-btn" data-copy="${p.crosshairCode}" type="button">复制</button>`
            : "待核实")}
          ${row("分辨率", (p) => p.res ?? "待核实")}
          ${row("屏幕", (p) => monitorTierOf(p) ?? "待核实")}
          ${row("外设", (p) => [p.mouse && "鼠 " + p.mouse, p.keyboard && "键 " + p.keyboard, p.headset && "耳 " + p.headset, p.mousepad && "垫 " + p.mousepad].filter(Boolean).join("<br>") || "待核实")}
          ${row("操作", (p) => `<button class="ct-chip" data-cmp-remove="${p.id}" type="button">✕ 移出</button>`)}
        </table>
      </div>
      <div class="d-section">
        <h3>同屏准星对比（实战 · 峡谷天际，真实大小）</h3>
        <div class="cmp-wall" style="${WALLS[0].style}">
          ${list.filter((p) => p.crosshairCode).map((p) => `
            <div class="cmp-cell">
              <span class="ch-box" style="width:64px;height:64px;color:${chColorOf(p)}">${crosshairParts(p, 64)}</span>
              <i>${p.name}</i>
            </div>`).join("")}
        </div>
      </div>`;
  }
  $("#modal").hidden = false;
  document.body.style.overflow = "hidden";
  const sel = $("#cmp-select");
  if (sel) sel.addEventListener("change", (e) => {
    if (!e.target.value) return;
    toggleCmp(e.target.value);
    openCmpModal();
  });
}

// 实战背景大图预览台 + 九宫格选择（选手详情与准星预设详情共用）
// 大图与九宫格共用同一组 WALLS 背景；准星均为游戏内真实大小（1080p 下 1 代码单位 ≈ 2px，k=2）
function mapStageHtml(p) {
  if (typeof WALLS === "undefined" || !WALLS.length) return "";
  return `
      <div class="map-stage" id="map-stage" data-wall="0" style="${WALLS[0].style}">
        <span class="ch-box" id="stage-ch" style="width:120px;height:120px;color:${chColorOf(p)}">${crosshairParts(p, 120)}</span>
        <div class="map-lens" id="map-lens">
          <div class="map-lens-inner" id="map-lens-inner" style="${WALLS[0].style}">
            <span class="ch-box lens-ch" style="width:120px;height:120px;color:${chColorOf(p)}">${crosshairParts(p, 120)}</span>
          </div>
        </div>
      </div>
      <div class="map-controls">
        <button class="mc-btn" data-act="prev" type="button">‹ 上个背景</button>
        <span class="map-name" id="map-name">${WALLS[0].label}</span>
        <button class="mc-btn" data-act="next" type="button">下个背景 ›</button>
        <span class="map-hint">准星为游戏内正常大小 · 鼠标凑近大图即放大 · 点下方九宫格也能换背景</span>
      </div>`;
}

function wallsHtml(p) {
  if (typeof WALLS === "undefined" || !WALLS.length) return "";
  const chL = hexLum(chColorOf(p));
  return `
      <div class="d-section">
        <h3>9 种实战背景可见性预览</h3>
        <p class="d-import">准星为游戏内正常大小 · 鼠标凑近小格可放大细看 · 点击小格切换上方大图背景</p>
        <div class="wall-grid">
          ${WALLS.map((w, i) => {
            const ratio = contrastRatio(chL, w.lum);
            const [tag, cls] = visibilityTag(ratio);
            return `
          <div class="wall-tile${i === 0 ? " active" : ""}" data-wall="${i}" data-pid="${p.id}" style="${w.style || ""}" title="${w.label} · 点击切换上方大图">
            <span class="ch-box" style="width:56px;height:56px;color:${chColorOf(p)}">${crosshairParts(p, 56)}</span>
            <i class="wall-label">${w.label}</i>
            <b class="wall-score ${cls}">${tag} ${ratio.toFixed(1)}</b>
          </div>`;
          }).join("")}
        </div>
      </div>`;
}

// ---------- 详情弹窗 ----------
function openDetail(id) {
  const p = PLAYERS.find((x) => x.id === id) || STREAMERS.find((x) => x.id === id) || PRESETS.find((x) => x.id === id);
  if (!p) {
    const w = WEAPONS.find((x) => x.id === id);
    if (w) return openWeaponDetail(w);
    const l = LINEUPS.find((x) => x.id === id);
    if (l) return openLineupDetail(l);
    return;
  }
  if (p.preset) return openPresetDetail(p);
  const fav = isFav(p.id);
  const chL = hexLum(chColorOf(p));
  $("#modal-body").innerHTML = `
    ${avatarHtml(p, true)}
    <div class="d-head">
      <h2>${p.name}</h2>
      <span class="card-role">${p.role ?? "待核实"}</span>
    </div>
    <p class="d-sub">${p.team} · ${p.teamFull} · ${p.region}赛区${p.nick ? ` · ${p.nick}` : ""}${p.realName ? ` · ${p.realName}` : ""}</p>
    ${p.verified
      ? `<p class="d-note ok">✔ 以下设置整理自公开资料并已核对（来源见页尾）。</p>`
      : `<p class="d-note">以下设置尚未核实，可能为占位数据；将持续更新完善。</p>`}

    <div class="d-section">
      <h3>灵敏度</h3>
      <div class="d-grid">
        <div class="d-item"><div class="k">鼠标 DPI</div><div class="v">${p.dpi ?? "待核实"}</div></div>
        <div class="d-item"><div class="k">游戏内灵敏度</div><div class="v">${p.sens ?? "待核实"}</div></div>
        <div class="d-item"><div class="k">eDPI（DPI×灵敏度）</div><div class="v">${p.dpi && p.sens ? edpiOf(p) : "待核实"}</div></div>
        <div class="d-item"><div class="k">360°转身距离</div><div class="v">${p.dpi && p.sens ? `约 ${cm360Of(p)} cm` : "待核实"}</div></div>
      </div>
    </div>

    <div class="d-section">
      <h3>准星</h3>
      <div class="d-cross">
        ${p.crosshairCode ? chBox(p, 56) : ""}
        ${p.crosshairColor ? `<span><i class="cross-dot" style="background:${CROSS_COLORS[p.crosshairColor]}"></i>${p.crosshairColor}</span>` : `<span>颜色待核实</span>`}
        <span class="code">${p.crosshairCode ?? "待核实"}</span>
        ${p.crosshairCode ? `<button class="copy-btn" data-copy="${p.crosshairCode}" type="button">复制代码</button>` : ""}
      </div>
      ${p.crosshairCode ? `<p class="d-import">导入方法：游戏内 → 设置 → 准星 → 导入准星代码 → 粘贴后确认</p>

      ${mapStageHtml(p)}

      ${wallsHtml(p)}` : ""}
    </div>

    <div class="d-section">
      <h3>画面设置</h3>
      <div class="d-grid">
        <div class="d-item"><div class="k">游戏内分辨率</div><div class="v">${p.res ?? "待核实"}</div></div>
        <div class="d-item"><div class="k">宽高比</div><div class="v">${p.aspect ?? "待核实"}</div></div>
        <div class="d-item"><div class="k">显示器分辨率</div><div class="v">${p.monitorRes ?? "待核实"}</div></div>
      </div>
    </div>

    <div class="d-section">
      <h3>外设装备</h3>
      <div class="d-grid">
        <div class="d-item"><div class="k">鼠标</div><div class="v">${p.mouse ?? "待核实"}</div></div>
        <div class="d-item"><div class="k">键盘</div><div class="v">${p.keyboard ?? "待核实"}</div></div>
        <div class="d-item"><div class="k">耳机</div><div class="v">${p.headset ?? "待核实"}</div></div>
        <div class="d-item"><div class="k">鼠标垫</div><div class="v">${p.mousepad ?? "待核实"}</div></div>
        <div class="d-item"><div class="k">显示器</div><div class="v">${p.monitor ?? "待核实"}</div></div>
      </div>
    </div>

    ${p.sources && p.sources.length ? `
    <div class="d-section">
      <h3>数据来源</h3>
      <ul class="d-src">${p.sources.map((s) => `<li><a href="${s}" target="_blank" rel="noreferrer">${s}</a></li>`).join("")}</ul>
    </div>` : ""}

    <button class="d-fav" data-copyfull type="button">📋 复制全套设置（分享给朋友）</button>
    <button class="d-fav ${fav ? "on" : ""}" data-dfav="${p.id}" type="button">
      ${fav ? "★ 已收藏（点击取消）" : "☆ 收藏这名选手"}
    </button>
  `;
  $("#modal-body").dataset.pid = p.id;
  initMapLens(p);
  $("#modal").hidden = false;
  document.body.style.overflow = "hidden";
}

// 武器详情：开枪节奏 + 弹道示意
function openWeaponDetail(w) {
  $("#modal-body").dataset.pid = "";
  $("#modal-body").innerHTML = `
    <div class="card-avatar big weapon-av"><span class="weapon-en">${w.en}</span></div>
    <div class="d-head"><h2>${w.name}</h2><span class="card-role">${w.type}</span></div>
    <p class="d-sub">${w.en} · ${w.price === 0 ? "免费" : w.price + " 信用点"} · 弹匣 ${w.mag} 发 · ${w.rate} · ${w.mode}</p>
    <div class="d-section">
      <h3>开枪节奏</h3>
      <div class="d-grid">
        ${w.cadence.map((c) => `<div class="d-item"><div class="k">${c.range}</div><div class="v">${c.style}</div></div>`).join("")}
      </div>
    </div>
    <div class="d-section">
      <h3>弹道示意（连发弹着走向）</h3>
      <div class="spray-box">${spraySvg(w, 320)}</div>
      <p class="d-import">弹着点分布为自制示意图，用于理解压枪方向（白=前几发，绿=中段，粉=后段）；实际弹道以游戏内为准。</p>
    </div>
    <div class="d-section"><h3>使用心得</h3><p class="d-import" style="font-size:13px;line-height:1.8">${w.tips}</p></div>
  `;
  $("#modal").hidden = false;
  document.body.style.overflow = "hidden";
}

// 点位详情：打法要点 + 视频出处链接
function openLineupDetail(l) {
  $("#modal-body").dataset.pid = "";
  $("#modal-body").innerHTML = `
    <div class="card-avatar big lineup-av"><span class="lu-map">${l.map}</span></div>
    <div class="d-head"><h2>${l.title}</h2><span class="card-role">${l.type}</span></div>
    <p class="d-sub">${l.map}${l.agent ? " · " + l.agent : ""} · 道具点位与进点教学</p>
    <div class="d-section">
      <h3>打法要点</h3>
      <p class="d-import" style="font-size:13px;line-height:1.9">${l.desc}</p>
    </div>
    ${(() => {
      const vids = (typeof LINEUP_VIDEOS !== "undefined" ? LINEUP_VIDEOS : []).filter((v) => v.map === l.map);
      if (!vids.length) return `<p class="d-note">该地图的视频教学整理中（只收录真实有效的出处链接），可先参考上方文字打法。</p>`;
      return `<div class="d-section">
        <h3>教学视频 · 出处（B 站）</h3>
        ${vids.map((v) => `
        <div class="lu-video">
          <div class="k">《${v.title}》</div>
          <div class="v">UP 主：<b>${v.author}</b>${v.play ? " · 播放 " + (v.play / 10000).toFixed(1) + " 万" : ""}${v.topic ? " · " + v.topic : ""}</div>
          <a class="copy-btn" style="text-decoration:none" href="${v.url}" target="_blank" rel="noreferrer">▶ 前往 B 站观看</a>
        </div>`).join("")}
        <p class="d-import">视频仅以链接跳转至 B 站原页面播放，版权归原 UP 主所有；若链接失效，可在 B 站搜索“${l.map} ${l.type} 教学”。</p>
      </div>`;
    })()}
  `;
  $("#modal").hidden = false;
  document.body.style.overflow = "hidden";
}

// 准星预设详情：突出样式预览 + 一键复制 + 地图/墙面效果（无灵敏度、外设等真人字段）
function openPresetDetail(p) {
  const fav = isFav(p.id);
  $("#modal-body").dataset.pid = p.id;
  $("#modal-body").innerHTML = `
    ${avatarHtml(p, true)}
    <div class="d-head">
      <h2>${p.name}</h2>
      <span class="card-role">${p.cat}样式</span>
    </div>
    <p class="d-sub">${p.team}准星 · 瓦境精选</p>
    <p class="d-note ok">✔ 准星代码逐字取自 valopins.cn 准星代码大全，可直接导入。</p>

    <div class="d-section">
      <h3>准星</h3>
      <div class="d-cross">
        ${chBox(p, 56)}
        <span><i class="cross-dot" style="background:${CROSS_COLORS[p.crosshairColor] || "#ccc"}"></i>${p.crosshairColor}</span>
        <span class="code">${p.crosshairCode}</span>
        <button class="copy-btn" data-copy="${p.crosshairCode}" type="button">复制代码</button>
      </div>
      <p class="d-import">导入方法：游戏内 → 设置 → 准星 → 导入准星代码 → 粘贴后确认</p>

      ${mapStageHtml(p)}
      ${wallsHtml(p)}

      <p class="d-import">来源：<a href="${p.source}" target="_blank" rel="noreferrer">${p.source}</a></p>
    </div>

    <button class="d-fav ${fav ? "on" : ""}" data-dfav="${p.id}" type="button">
      ${fav ? "★ 已收藏（点击取消）" : "☆ 收藏这个准星"}
    </button>
  `;
  initMapLens(p);
  $("#modal").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  $("#modal").hidden = true;
  document.body.style.overflow = "";
}

// ---------- 复制（兼容双击本地文件打开的场景） ----------
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { /* 忽略 */ }
    ta.remove();
    return ok;
  }
}

let toastTimer = null;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 1800);
}

// ---------- 收藏筛选按钮 ----------
function renderFavButton() {
  const n = loadFavs().length;
  const btn = $("#fav-toggle");
  btn.textContent = `☆ 只看收藏（${n}）`;
  btn.classList.toggle("active", state.favOnly);
  if (state.favOnly && n === 0) { state.favOnly = false; btn.classList.remove("active"); }
}

// ---------- Hero 统计卡片 ----------
function renderStats() {
  const total = PLAYERS.length;
  const verified = PLAYERS.filter((p) => p.verified).length;
  const teams = new Set(PLAYERS.map((p) => p.team)).size;
  const photos = typeof PHOTOS !== "undefined" ? PHOTOS.length : 0;
  const cards = [
    [total, "收录选手"], [verified, "已核实设置"], [teams, "覆盖战队"], [photos, "真实照片"],
  ];
  $("#hero-stats").innerHTML = cards
    .map(([n, label]) => `<div class="stat-card"><b>${n}</b><i>${label}</i></div>`)
    .join("");
}

// ---------- 地图预览台：放大镜（场景中准星为正常大小，鼠标凑近即放大细节） ----------
function initMapLens() {
  const stage = $("#map-stage");
  const lens = $("#map-lens");
  const inner = $("#map-lens-inner");
  if (!stage || !lens || !inner) return;
  const R = 80;   // 放大镜半径
  const Z = 3;    // 放大倍数
  stage.addEventListener("mousemove", (e) => {
    const rect = stage.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    lens.style.left = `${x - R}px`;
    lens.style.top = `${y - R}px`;
    lens.style.opacity = "1";
    // 镜内副本与舞台等尺寸，缩放后平移使鼠标所指的点落在镜片中心
    inner.style.width = `${rect.width}px`;
    inner.style.height = `${rect.height}px`;
    inner.style.transform = `translate(${R - x * Z}px, ${R - y * Z}px) scale(${Z})`;
  });
  stage.addEventListener("mouseleave", () => { lens.style.opacity = "0"; });
}

// 切换大图预览台的实战背景（九宫格点击 / 前后按钮共用），九宫格高亮同步
function setStageWall(i) {
  const stage = $("#map-stage");
  if (!stage || !WALLS.length) return;
  const n = WALLS.length;
  i = ((i % n) + n) % n;
  stage.dataset.wall = i;
  stage.style.cssText = WALLS[i].style;
  const inner = $("#map-lens-inner");
  if (inner) inner.style.cssText = WALLS[i].style;
  $("#map-name").textContent = WALLS[i].label;
  document.querySelectorAll(".wall-tile").forEach((t) => t.classList.toggle("active", +t.dataset.wall === i));
}

// ---------- 9 种实战背景（借鉴参考站：不同场景/光照下检验准星可见性） ----------
// 前 3 项为互不相同的真实第一人称实机截图，亮度取自图片中心区域（准星实际所在处）的实测值
const WALLS = [
  { label: "实战 · 峡谷天际", lum: 0.111, style: "background-image:url('assets/地图/实战-峡谷天际.jpg?v=2');background-size:cover;background-position:center" },
  { label: "实战 · 烟雾中路", lum: 0.332, style: "background-image:url('assets/地图/实战-烟雾中路.jpg?v=2');background-size:cover;background-position:center" },
  { label: "实战 · 对枪贴墙", lum: 0.179, style: "background-image:url('assets/地图/实战-对枪贴墙.jpg?v=2');background-size:cover;background-position:center" },
  { label: "暗角", lum: 0.015, style: "background:linear-gradient(160deg,#1a2129,#0a0e12)" },
  { label: "白墙", lum: 0.66, style: "background:linear-gradient(160deg,#d6dde2,#a8b2ba)" },
  { label: "木箱", lum: 0.17, style: "background:repeating-linear-gradient(90deg,#8a6a48 0 14px,#755a3d 14px 17px)" },
  { label: "金属", lum: 0.085, style: "background:linear-gradient(160deg,#4a5560,#363f48)" },
  { label: "烟雾", lum: 0.4, style: "background:radial-gradient(circle at 42% 42%,#a8b4bd,#68737c)" },
  { label: "霓虹", lum: 0.045, style: "background:linear-gradient(160deg,#3b2a5a,#1d1430)" },
];

// ---------- 可见性评分（原创：按对比度判断准星在背景上的清晰程度） ----------
function hexLum(hex) {
  const h = hex.replace("#", "");
  const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const f = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
}
function contrastRatio(l1, l2) {
  const a = Math.max(l1, l2), b = Math.min(l1, l2);
  return (a + 0.05) / (b + 0.05);
}
function visibilityTag(ratio) {
  return ratio >= 7 ? ["清晰", "good"] : ratio >= 3 ? ["可见", "mid"] : ["吃力", "bad"];
}

// ---------- 一键抄作业卡（原创：全套设置复制为分享文本） ----------
function fullSettingsText(p) {
  const lines = [`【赋能模拟器】${p.name}（${p.team}${p.realName ? " · " + p.realName : ""}）设置卡`];
  if (p.dpi && p.sens) lines.push(`DPI ${p.dpi} × 灵敏度 ${p.sens} = eDPI ${edpiOf(p)}（${tierOf(p)}）· 360°约 ${cm360Of(p)}cm`);
  if (p.crosshairCode) lines.push(`准星代码：${p.crosshairCode}${p.crosshairColor ? "（" + p.crosshairColor + "）" : ""}`);
  if (p.res) lines.push(`画面：${p.res}${p.aspect ? " · " + p.aspect : ""}${p.monitorRes ? " · 屏幕 " + p.monitorRes : ""}`);
  const gear = [
    p.mouse && "鼠标 " + p.mouse, p.keyboard && "键盘 " + p.keyboard, p.headset && "耳机 " + p.headset,
    p.mousepad && "鼠标垫 " + p.mousepad, p.monitor && "显示器 " + p.monitor,
  ].filter(Boolean);
  if (gear.length) lines.push("外设：" + gear.join(" / "));
  if (p.source) lines.push("来源：" + p.source);
  return lines.join("\n");
}

// ---------- 灵敏度实验室（原创：换算 + 手感匹配 + 分布图） ----------
function openSensTool() {
  $("#modal-body").dataset.pid = "";
  $("#modal-body").innerHTML = `
    <div class="d-head"><h2>灵敏度实验室</h2></div>
    <p class="d-sub">输入你自己的设置：换算 360° 转身距离、匹配手感最接近的职业选手、查看你在全部选手中的位置</p>
    <div class="sens-form">
      <label>鼠标 DPI <input id="my-dpi" type="number" min="50" step="50" value="800"></label>
      <label>游戏内灵敏度 <input id="my-sens" type="number" min="0.01" step="0.001" value="0.35"></label>
      <button class="copy-btn" id="sens-go" type="button">分析手感</button>
    </div>
    <div id="sens-result"></div>`;
  $("#modal").hidden = false;
  document.body.style.overflow = "hidden";
  const run = () => {
    const dpi = parseFloat($("#my-dpi").value);
    const sens = parseFloat($("#my-sens").value);
    if (!(dpi > 0 && sens > 0)) { $("#sens-result").innerHTML = `<p class="d-note">请输入有效的 DPI 和灵敏度。</p>`; return; }
    const myEdpi = Number((dpi * sens).toFixed(1));
    const myCm = (2.54 * 360 / (0.07 * myEdpi)).toFixed(1);
    const pool = PLAYERS.filter((x) => x.verified && x.dpi && x.sens);
    const near = [...pool].sort((a, b) => Math.abs(edpiOf(a) - myEdpi) - Math.abs(edpiOf(b) - myEdpi)).slice(0, 3);
    const min = Math.min(...pool.map(edpiOf)), max = Math.max(...pool.map(edpiOf));
    const pos = (v) => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
    $("#sens-result").innerHTML = `
      <div class="d-section">
        <h3>你的数据</h3>
        <div class="d-grid">
          <div class="d-item"><div class="k">你的 eDPI</div><div class="v">${myEdpi}</div></div>
          <div class="d-item"><div class="k">360°转身距离</div><div class="v">约 ${myCm} cm</div></div>
          <div class="d-item"><div class="k">灵敏度档位</div><div class="v">${tierOf({ dpi, sens })}</div></div>
        </div>
      </div>
      <div class="d-section">
        <h3>手感最接近的职业选手（点击查看详情）</h3>
        ${near.map((x) => `
          <div class="sens-match" data-open="${x.id}">
            <span class="sm-name">${x.name}</span>
            <span class="sm-team">${x.team} · ${x.teamFull}</span>
            <span class="sm-edpi">eDPI ${edpiOf(x)}（与你相差 ${Math.abs(edpiOf(x) - myEdpi).toFixed(1)}）</span>
            <span class="sm-go">查看 →</span>
          </div>`).join("")}
        <p class="d-import">同款手感换算：想在 DPI ${dpi} 下打出 <b>${near[0].name}</b> 的 eDPI（${edpiOf(near[0])}）？把灵敏度设为 <b>${(edpiOf(near[0]) / dpi).toFixed(3)}</b> 即可。</p>
      </div>
      <div class="d-section">
        <h3>职业选手 eDPI 分布（红点 = 你）</h3>
        <div class="dist-track">
          ${pool.map((x) => `<i class="dist-dot" style="left:${pos(edpiOf(x))}%" title="${x.name} · eDPI ${edpiOf(x)}"></i>`).join("")}
          <i class="dist-dot me" style="left:${pos(myEdpi)}%"></i>
        </div>
        <p class="d-import">全体范围：${min} ~ ${max} eDPI</p>
      </div>`;
    $("#sens-result").querySelectorAll("[data-open]").forEach((el) =>
      el.addEventListener("click", () => openDetail(el.dataset.open)));
  };
  $("#sens-go").addEventListener("click", run);
  run();
}

// ---------- 今日推荐（原创：按日期轮换，当天全站一致） ----------
function renderDaily() {
  const pool = PLAYERS.filter((p) => p.verified);
  if (!pool.length) return;
  const pick = pool[Math.floor(Date.now() / 86400000) % pool.length];
  $("#daily-pick").innerHTML = `🔥 今日推荐 · <b>${pick.name}</b>（${pick.team}）—— 点看他的准星与全套设置`;
  $("#daily-pick").onclick = () => openDetail(pick.id);
}

// ---------- 事件绑定 ----------
function bindEvents() {
  $("#search").addEventListener("input", (e) => { state.search = e.target.value; renderGrid(); });

  const map = { "f-region": "region", "f-team": "team", "f-role": "role", "f-tier": "tier", "f-color": "color" };
  for (const [id, key] of Object.entries(map)) {
    $(`#${id}`).addEventListener("change", (e) => { state[key] = e.target.value; renderGrid(); });
  }

  $("#fav-toggle").addEventListener("click", () => {
    if (!state.favOnly && loadFavs().length === 0) { toast("还没有收藏，先点卡片右上角的 ☆ 吧"); return; }
    state.favOnly = !state.favOnly;
    renderFavButton();
    renderGrid();
  });

  $("#reset").addEventListener("click", () => {
    Object.assign(state, { search: "", region: "", team: "", role: "", tier: "", color: "", pcolor: "", favOnly: false });
    $("#search").value = "";
    for (const id of ["f-region", "f-team", "f-role", "f-tier", "f-color"]) $(`#${id}`).value = "";
    renderFavButton();
    renderGrid();
  });

  // 导航：首页 / 选手库 / 热门准星 视图切换
  document.querySelectorAll(".nav-links a").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (a.dataset.view) setView(a.dataset.view);
      const target = a.getAttribute("href") === "#top" ? "#top" : "#browse";
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }));

  // Hero 区按钮：锚点滚动 / 收藏视图 / 即将上线提示
  document.querySelectorAll("[data-scroll]").forEach((b) =>
    b.addEventListener("click", () => document.querySelector(b.dataset.scroll)?.scrollIntoView({ behavior: "smooth" })));
  document.querySelector("[data-act-fav]")?.addEventListener("click", () => {
    $("#fav-toggle").click();
    document.querySelector("#browse").scrollIntoView({ behavior: "smooth" });
  });
  document.querySelector("[data-tool]")?.addEventListener("click", openSensTool);
  document.querySelector("[data-random]")?.addEventListener("click", () => {
    const pool = PLAYERS.filter((p) => p.verified);
    openDetail(pool[Math.floor(Math.random() * pool.length)].id);
  });

  // 智慧快筛：准星颜色一键过滤（预设视图）
  $("#chips").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-chip]");
    if (!chip) return;
    state.pcolor = chip.dataset.chip;
    renderGrid();
  });

  // 卡片：点击开详情；点星标只切收藏；点 ⚖ 只切对比
  $("#grid").addEventListener("click", (e) => {
    const star = e.target.closest("[data-star]");
    if (star) { e.stopPropagation(); toggleFav(star.dataset.star); return; }
    const cmpBtn = e.target.closest("[data-cmp]");
    if (cmpBtn) { e.stopPropagation(); toggleCmp(cmpBtn.dataset.cmp); return; }
    const card = e.target.closest("[data-id]");
    if (card) openDetail(card.dataset.id);
  });

  // 九宫格凑近放大镜：等比例放大（背景+准星整体放大 3 倍，与鼠标位置精确对位）
  const lensR = 85, lensZ = 3;
  let tileLensEl = null, tileLensPid = "";
  const hideTileLens = () => { if (tileLensEl) tileLensEl.style.display = "none"; };
  document.addEventListener("mousemove", (e) => {
    if (e.target.closest && !e.target.closest(".wall-tile")) { hideTileLens(); return; }
    const tile = e.target.closest(".wall-tile");
    if (!tile) { hideTileLens(); return; }
    const p = PLAYERS.find((x) => x.id === tile.dataset.pid) || STREAMERS.find((x) => x.id === tile.dataset.pid) || PRESETS.find((x) => x.id === tile.dataset.pid);
    if (!p) { hideTileLens(); return; }
    if (!tileLensEl) {
      tileLensEl = document.createElement("div");
      tileLensEl.className = "tile-lens";
      tileLensEl.innerHTML = '<div class="tile-lens-inner"></div>';
      document.body.appendChild(tileLensEl);
    }
    const inner = tileLensEl.firstElementChild;
    if (tile.dataset.pid !== tileLensPid) {
      tileLensPid = tile.dataset.pid;
      inner.innerHTML = `<span class="ch-box" style="width:56px;height:56px;color:${chColorOf(p)}">${crosshairParts(p, 56)}</span>`;
    }
    const rect = tile.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    // 内层与九宫格同尺寸同背景，整体放大后平移，使鼠标所指点正好落在镜片中心
    inner.style.cssText = tile.style.cssText;
    inner.style.width = rect.width + "px";
    inner.style.height = rect.height + "px";
    inner.style.transform = `translate(${lensR - x * lensZ}px, ${lensR - y * lensZ}px) scale(${lensZ})`;
    tileLensEl.style.left = (e.clientX - lensR) + "px";
    tileLensEl.style.top = (e.clientY - lensR) + "px";
    tileLensEl.style.display = "block";
  });
  document.addEventListener("mouseleave", hideTileLens);
  document.addEventListener("scroll", hideTileLens, true);

  // 底部对比栏：移除 / 开始对比 / 清空
  $("#cmp-tray").addEventListener("click", (e) => {
    const rm = e.target.closest("[data-cmp-remove]");
    if (rm) { toggleCmp(rm.dataset.cmpRemove); return; }
    if (e.target.closest("[data-cmp-open]")) { openCmpModal(); return; }
    if (e.target.closest("[data-cmp-clear]")) { saveCmp([]); renderCmpTray(); renderGrid(); toast("已清空对比栏"); }
  });
  $("#cmp-open").addEventListener("click", openCmpModal);

  // 弹窗内：地图预览台 / 复制 / 收藏 / 关闭
  $("#modal-body").addEventListener("click", async (e) => {
    const act = e.target.closest("[data-act]");
    if (act) {
      const stage = $("#map-stage");
      if (!stage) return;
      let idx = +stage.dataset.wall || 0;
      if (act.dataset.act === "prev") idx -= 1;
      if (act.dataset.act === "next") idx += 1;
      setStageWall(idx);
      return;
    }
    // 点击九宫格小格：切换上方大图背景
    const tile = e.target.closest("[data-wall]");
    if (tile) { setStageWall(+tile.dataset.wall); return; }
    const cfBtn = e.target.closest("[data-copyfull]");
    if (cfBtn) {
      const me = PLAYERS.find((x) => x.id === $("#modal-body").dataset.pid);
      if (me) {
        const ok = await copyText(fullSettingsText(me));
        toast(ok ? "全套设置已复制，可直接粘贴分享" : "复制失败，请重试");
      }
      return;
    }
    const copyBtn = e.target.closest("[data-copy]");
    if (copyBtn) {
      const ok = await copyText(copyBtn.dataset.copy);
      toast(ok ? "准星代码已复制，进游戏粘贴导入即可" : "复制失败，请手动选中代码复制");
      return;
    }
    const dfav = e.target.closest("[data-dfav]");
    if (dfav) {
      const id = dfav.dataset.dfav;
      toggleFav(id);
      const fav = isFav(id);
      const noun = id.startsWith("pre-") ? "这个准星" : "这名选手";
      dfav.classList.toggle("on", fav);
      dfav.textContent = fav ? "★ 已收藏（点击取消）" : `☆ 收藏${noun}`;
      return;
    }
    // 对比弹窗里的"移出"：移出后重建对比视图
    const rmBtn = e.target.closest("[data-cmp-remove]");
    if (rmBtn) {
      toggleCmp(rmBtn.dataset.cmpRemove);
      openCmpModal();
      return;
    }
  });

  $("#modal-close").addEventListener("click", closeDetail);
  $("#modal-mask").addEventListener("click", closeDetail);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDetail(); });
}

// ---------- 启动 ----------
initSelects();
renderStats();
renderDaily();
renderFavButton();
renderCmpTray();
renderGrid();
bindEvents();
