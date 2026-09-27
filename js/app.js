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

// ---------- 计算字段 ----------
const edpiRaw = (p) => p.dpi * p.sens;
const edpiOf = (p) => Number(edpiRaw(p).toFixed(1));   // 去掉浮点长尾，如 231.99999… → 232
const cm360Of = (p) => (2.54 * 360 / (0.07 * edpiRaw(p))).toFixed(1);
const tierOf = (p) => {
  const e = edpiRaw(p);
  return (TIER_RULES.find((t) => e <= t.max) || TIER_RULES[TIER_RULES.length - 1]).key;
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

  const roles = [...new Set(PLAYERS.map((p) => p.role))];
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
      <button class="card-star ${isFav(p.id) ? "on" : ""}" data-star="${p.id}"
              title="收藏" aria-label="收藏">${isFav(p.id) ? "★" : "☆"}</button>
      <div class="card-head">
        <span class="card-name">${p.name}</span>
        <span class="card-role">${p.role}</span>
      </div>
      <div class="card-team"><b>${p.team}</b> · ${p.teamFull} · ${p.region}</div>
      <div class="card-stats">
        <span>eDPI <b>${edpiOf(p)}</b>（${tierOf(p)}）</span>
        <span>DPI ${p.dpi} × 灵敏度 ${p.sens}</span>
        <span>360°约 <b>${cm360Of(p)}cm</b></span>
        <span><i class="cross-dot" style="background:${CROSS_COLORS[p.crosshairColor]}"></i>准星 ${p.crosshairColor} · ${p.hz}Hz 屏</span>
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
    <div class="d-head">
      <h2>${p.name}</h2>
      <span class="card-role">${p.role}</span>
    </div>
    <p class="d-sub">${p.team} · ${p.teamFull} · ${p.region}赛区</p>
    <p class="d-note">以下为演示占位数据，正式版将逐条核实公开资料后录入。</p>

    <div class="d-section">
      <h3>灵敏度</h3>
      <div class="d-grid">
        <div class="d-item"><div class="k">鼠标 DPI</div><div class="v">${p.dpi}</div></div>
        <div class="d-item"><div class="k">游戏内灵敏度</div><div class="v">${p.sens}</div></div>
        <div class="d-item"><div class="k">eDPI（DPI×灵敏度）</div><div class="v">${edpiOf(p)}</div></div>
        <div class="d-item"><div class="k">360°转身距离</div><div class="v">约 ${cm360Of(p)} cm</div></div>
      </div>
    </div>

    <div class="d-section">
      <h3>准星</h3>
      <div class="d-cross">
        <span><i class="cross-dot" style="background:${CROSS_COLORS[p.crosshairColor]}"></i>${p.crosshairColor}</span>
        <span class="code">${p.crosshairCode}</span>
        <button class="copy-btn" data-copy="${p.crosshairCode}" type="button">复制代码</button>
      </div>
    </div>

    <div class="d-section">
      <h3>画面设置</h3>
      <div class="d-grid">
        <div class="d-item"><div class="k">分辨率</div><div class="v">${p.resolution}</div></div>
        <div class="d-item"><div class="k">宽高比</div><div class="v">${p.aspect}</div></div>
        <div class="d-item"><div class="k">刷新率</div><div class="v">${p.hz} Hz</div></div>
      </div>
    </div>

    <div class="d-section">
      <h3>外设装备</h3>
      <div class="d-grid">
        <div class="d-item"><div class="k">鼠标</div><div class="v">${p.mouse}</div></div>
        <div class="d-item"><div class="k">键盘</div><div class="v">${p.keyboard}</div></div>
        <div class="d-item"><div class="k">耳机</div><div class="v">${p.headset}</div></div>
        <div class="d-item"><div class="k">鼠标垫</div><div class="v">${p.mousepad}</div></div>
        <div class="d-item"><div class="k">显示器</div><div class="v">${p.monitor}</div></div>
      </div>
    </div>

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
renderFavButton();
renderGrid();
bindEvents();
