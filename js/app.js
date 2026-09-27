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
};

const REGIONS = ["中国", "美洲", "EMEA", "太平洋"];

const state = { search: "", region: "", team: "", role: "", tier: "", color: "", favOnly: false };

// ---------- 可视化头像 ----------
// 统一风格：队伍主题色渐变 + 选手照片（如有）+ 战队标志背景水印（如有）+ 首字母兜底
const TEAM_COLORS = {
  EDG: ["#ff4655", "#6e1620"], TE: ["#f7c948", "#6b5310"], BLG: ["#4da6ff", "#123a66"],
  FPX: ["#ff6a3d", "#6e2413"], WOL: ["#9fb3c2", "#2b3d4f"], DRG: ["#ffb14d", "#6e4a10"],
  AG: ["#35d0a5", "#0d4a3a"], TEC: ["#b58cff", "#3a2466"], JDG: ["#ff5c5c", "#661a1a"],
  TYLOO: ["#ff8566", "#66291a"], XLG: ["#5ee0ff", "#0e4a5a"], NOVA: ["#ffd166", "#5a4712"],
  自由人: ["#9aa7b1", "#39434c"],
  FNC: ["#ff5900", "#5a2400"], PRX: ["#ff4d88", "#5a1a33"], SEN: ["#ff4655", "#661a1a"],
  DRX: ["#4da6ff", "#123a66"], GEN: ["#e8c35a", "#4a3c12"],
};

// 照片文件名大小写不敏感匹配（vlr 别名大小写与显示名可能不同）
const PHOTO_FILE = {};
(typeof PHOTOS !== "undefined" ? PHOTOS : []).forEach((a) => { PHOTO_FILE[a.toLowerCase()] = a; });

function hashStr(s) {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.codePointAt(0)) | 0;
  return Math.abs(h);
}

function avatarHtml(p, big = false) {
  const [c1, c2] = TEAM_COLORS[p.team] || ["#3d5871", "#16222e"];
  const initials = (p.name.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 2) || "??").toUpperCase();
  const angle = 105 + (hashStr(p.id || p.name) % 5) * 14;   // 同队不同选手，纹理角度略有差异
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

// 把准星代码画成图形；size=预览盒边长(px)，1个游戏单位≈3px
function crosshairParts(p, size) {
  if (!p.crosshairCode) return "";
  const kv = parseCross(p.crosshairCode);
  const num = (k, d) => { const v = parseFloat(kv[k]); return Number.isFinite(v) ? v : d; };
  const half = size / 2;
  const K = 3;
  const parts = [];
  const dot = kv.d === "1";
  const z = Math.min(num("z", 1) * 2 + 2, half);
  const iT = Math.max(2, num("0t", 1) * 2);
  const iL = Math.min(num("0l", 0) * K, half - 2);
  const iO = Math.min(num("0o", 1) * K + (dot ? z / 2 : 0), half - 2);
  const oL = Math.min(num("1l", 0) * K, half - 2);
  const oO = Math.min(num("1o", 0) * K + iO + iL, half - 2);
  const oT = Math.max(2, num("1t", 1) * 2);
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
function renderGrid() {
  const list = filteredPlayers();
  $("#count").innerHTML = `共 <b>${list.length}</b> 名选手`;
  $("#empty").hidden = list.length > 0;
  $("#grid").innerHTML = list.map((p) => `
    <article class="card" data-id="${p.id}">
      ${avatarHtml(p)}
      <button class="card-star ${isFav(p.id) ? "on" : ""}" data-star="${p.id}"
              title="收藏" aria-label="收藏">${isFav(p.id) ? "★" : "☆"}</button>
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
  `).join("");
}

// ---------- 详情弹窗 ----------
function openDetail(id) {
  const p = PLAYERS.find((x) => x.id === id);
  if (!p) return;
  const fav = isFav(p.id);
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
        ${p.crosshairCode ? chBox(p, 88) : ""}
        ${p.crosshairColor ? `<span><i class="cross-dot" style="background:${CROSS_COLORS[p.crosshairColor]}"></i>${p.crosshairColor}</span>` : `<span>颜色待核实</span>`}
        <span class="code">${p.crosshairCode ?? "待核实"}</span>
        ${p.crosshairCode ? `<button class="copy-btn" data-copy="${p.crosshairCode}" type="button">复制代码</button>` : ""}
      </div>
      ${p.crosshairCode ? `<p class="d-import">导入方法：游戏内 → 设置 → 准星 → 导入准星代码 → 粘贴后确认</p>` : ""}
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

    <button class="d-fav ${fav ? "on" : ""}" data-dfav="${p.id}" type="button">
      ${fav ? "★ 已收藏（点击取消）" : "☆ 收藏这名选手"}
    </button>
  `;
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

// ---------- 页头统计条 ----------
function renderStats() {
  const total = PLAYERS.length;
  const verified = PLAYERS.filter((p) => p.verified).length;
  const teams = new Set(PLAYERS.map((p) => p.team)).size;
  $("#stats-strip").innerHTML =
    `<span>收录 <b>${total}</b> 名选手</span>` +
    `<span>已核实 <b>${verified}</b> 人</span>` +
    `<span>覆盖 <b>${teams}</b> 支战队</span>`;
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
    Object.assign(state, { search: "", region: "", team: "", role: "", tier: "", color: "", favOnly: false });
    $("#search").value = "";
    for (const id of ["f-region", "f-team", "f-role", "f-tier", "f-color"]) $(`#${id}`).value = "";
    renderFavButton();
    renderGrid();
  });

  // 卡片：点击开详情；点星标只切收藏
  $("#grid").addEventListener("click", (e) => {
    const star = e.target.closest("[data-star]");
    if (star) { e.stopPropagation(); toggleFav(star.dataset.star); return; }
    const card = e.target.closest("[data-id]");
    if (card) openDetail(card.dataset.id);
  });

  // 弹窗内：复制 / 收藏 / 关闭
  $("#modal-body").addEventListener("click", async (e) => {
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
      dfav.classList.toggle("on", fav);
      dfav.textContent = fav ? "★ 已收藏（点击取消）" : "☆ 收藏这名选手";
    }
  });

  $("#modal-close").addEventListener("click", closeDetail);
  $("#modal-mask").addEventListener("click", closeDetail);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDetail(); });
}

// ---------- 启动 ----------
initSelects();
renderStats();
renderFavButton();
renderGrid();
bindEvents();
