/* ============================================================
   CusCus · 订单分析（双模式：店铺 / 达人）
   - 自动识别 CSV 类型
   - 店铺：销售 / 寄样 / 物流 / 地理
   - 达人：达人 / 内容 / 佣金
   ------------------------------------------------------------
   design & build · Yann · 2026
   ============================================================ */

// ════════════════════════════════════════════════════════════
// CSV 解析（替代 XLSX hack · 处理引号 / Tab / CRLF / BOM）
// ════════════════════════════════════════════════════════════

function parseCSV(text) {
  if (!text) return { headers: [], rows: [] };
  text = text.replace(/^﻿/, "");

  // 自动判分隔符（Tab vs Comma）
  const firstLine = text.split(/\r?\n/).find(l => l.length > 0) || "";
  const tabs = (firstLine.match(/\t/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  const delim = tabs > commas ? "\t" : ",";

  const rows = [];
  let row = [];
  let cell = "";
  let inQuote = false;
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const ch = text[i];

    if (inQuote) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else { inQuote = false; }
      } else { cell += ch; }
      continue;
    }

    if (ch === '"') { inQuote = true; continue; }
    if (ch === delim) { row.push(cell); cell = ""; continue; }
    if (ch === "\r") { if (text[i + 1] === "\n") i++; row.push(cell); cell = "";
      if (row.some(c => c.length)) rows.push(row); row = []; continue; }
    if (ch === "\n") { row.push(cell); cell = "";
      if (row.some(c => c.length)) rows.push(row); row = []; continue; }
    cell += ch;
  }
  if (cell.length || row.length) {
    row.push(cell);
    if (row.some(c => c.length)) rows.push(row);
  }

  if (!rows.length) return { headers: [], rows: [] };

  // trim 每个值（去除字段值里残留的 \t——TikTok 导出文件里常见）
  const cleanCell = v => String(v ?? "").replace(/\t/g, "").trim();
  const headers = rows[0].map(cleanCell);
  const dataRows = rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = cleanCell(r[idx] ?? ""); });
    return obj;
  });

  return { headers, rows: dataRows };
}

// ════════════════════════════════════════════════════════════
// 模式识别
// ════════════════════════════════════════════════════════════

const MODE_SIGNATURE = {
  shop:      ["Order Substatus", "Recipient", "SKU Subtotal Before Discount", "Buyer Username", "Detail Address"],
  affiliate: ["Creator Username", "Standard commission rate", "Content ID", "Est. Commission Base", "Actual Commission Payment"]
};

function detectMode(headers) {
  const set = new Set(headers);
  let shopHits = 0, affHits = 0;
  MODE_SIGNATURE.shop.forEach(k => { if (set.has(k)) shopHits++; });
  MODE_SIGNATURE.affiliate.forEach(k => { if (set.has(k)) affHits++; });
  if (affHits >= 2) return "affiliate";
  if (shopHits >= 2) return "shop";
  return null;
}

// ════════════════════════════════════════════════════════════
// 通用 helpers
// ════════════════════════════════════════════════════════════

const tt = (key, vars) => {
  if (typeof window.t === "function") return window.t(key, vars);
  return key;
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatLocalDateKey(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDate(str) {
  if (!str || !str.trim()) return null;
  const m = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (!m) return null;
  const [, day, month, year, h = "0", mi = "0", s = "0"] = m;
  return new Date(+year, +month - 1, +day, +h, +mi, +s);
}

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("zh-CN");
}

const FX_IDR_PER_CNY = 2500;
let displayCurrency = localStorage.getItem("currency") || "IDR";

function convertMoney(value, baseCurrency = "IDR") {
  const n = parseFloat(value);
  if (!isFinite(n)) return 0;
  if (displayCurrency === baseCurrency) return n;
  if (baseCurrency === "IDR" && displayCurrency === "CNY") return n / FX_IDR_PER_CNY;
  if (baseCurrency === "CNY" && displayCurrency === "IDR") return n * FX_IDR_PER_CNY;
  return n;
}

function formatCurrency(value, baseCurrency = "IDR") {
  const converted = convertMoney(value, baseCurrency);
  if (displayCurrency === "CNY") {
    return `${converted.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CNY`;
  }
  return `${Math.round(converted).toLocaleString("zh-CN")} IDR`;
}

function formatPercent(n, digits = 2) {
  if (!isFinite(n)) return "—";
  return `${n.toFixed(digits)}%`;
}

// 印尼习惯：百万 = juta · 千 = ribu。卡片里数字太长就缩写。
function formatJuta(value) {
  const n = convertMoney(value);
  if (displayCurrency === "CNY") {
    if (n >= 10_000) return `${(n / 10_000).toFixed(1)}w`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return n.toLocaleString("zh-CN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)} M`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)} jt`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(0)} rb`;
  return Math.round(n).toLocaleString("zh-CN");
}

// 拼 TikTok 视频 URL（只对 Video 类型生效，其他类型 URL 拼不出来）
function getContentURL(contentId, creator, contentType) {
  if (!contentId) return null;
  if (contentType === "Video" && creator) {
    return `https://www.tiktok.com/@${encodeURIComponent(creator)}/video/${encodeURIComponent(contentId)}`;
  }
  return null;
}

// 内容类型 → CSS class slug（"External Traffic Program" → "External"）
function contentTypeSlug(type) {
  if (!type) return "Other";
  if (type === "External Traffic Program") return "External";
  if (/^[A-Za-z]+$/.test(type)) return type;
  return "Other";
}

function getProductName(sku) {
  const map = window.SKU_MAPPING || {};
  if (!sku) return "";
  const cleaned = String(sku).trim();
  if (map[cleaned]) return map[cleaned];

  // order-agnostic 匹配
  const norm = s => String(s).split("+").map(x => x.trim()).filter(Boolean).sort().join("+");
  const target = norm(cleaned);
  for (const [k, v] of Object.entries(map)) {
    if (norm(k) === target) return v;
  }

  // fallback
  if (cleaned.match(/^00016/)) return getProductName(cleaned.replace(/^00016/, "0016"));
  if (cleaned === "8990144000016*2") return "防晒乳*2";
  return cleaned;
}

// ════════════════════════════════════════════════════════════
// 状态 / 取消原因 中文映射
// ════════════════════════════════════════════════════════════

const CANCEL_REASON_ZH = {
  "Package delivery failed": "包裹配送失败",
  "No longer needed": "不再需要",
  "Customer overdue to pay": "买家逾期未付款",
  "Need to change payment method": "需更换支付方式",
  "High delivery costs": "运费过高",
  "Need to change shipping address": "需更改收货地址",
  "Better price available": "有更优价格",
  "Out of stock": "缺货",
  "Need to change color or size": "需更换颜色或尺寸",
  "Seller not responsive to inquiries": "卖家未回复",
  "Seller requesting order cancellation": "卖家申请取消",
  "Payment method not available": "支付方式不可用",
  "Product didn't arrive on time": "商品未按时送达"
};
function translateCancelReason(en) {
  const t = (en || "").trim();
  return CANCEL_REASON_ZH[t] || (t || "未填写");
}

// ════════════════════════════════════════════════════════════
// State
// ════════════════════════════════════════════════════════════

const PAGE_SIZE = 50;
const state = {
  mode: "shop",                                      // 当前激活模式
  shop:      { orders: [], filtered: [], page: 1 },
  affiliate: { orders: [], filtered: [], page: 1 }
};
const chartInstances = {};

// ════════════════════════════════════════════════════════════
// 图表通用
// ════════════════════════════════════════════════════════════

const PIE_PALETTE = [
  "#FF7500", "#CDB1FF", "#8DE3BE", "#FFD93D",
  "#FFB5A0", "#9A7BE8", "#62B89A", "#FF5A1F",
  "#B8DCFF", "#F27A5C"
];

function destroyChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}

function renderPieChart(canvasId, entries, opts = {}) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  if (!entries.length) {
    const c = ctx.getContext("2d");
    c.clearRect(0, 0, ctx.width, ctx.height);
    c.fillStyle = "#9aa3b2";
    c.font = "14px system-ui";
    c.textAlign = "center";
    c.fillText(opts.emptyText || "暂无数据", ctx.width / 2, ctx.height / 2);
    return;
  }
  const total = entries.reduce((s, [, c]) => s + c, 0);
  chartInstances[canvasId] = new Chart(ctx, {
    type: opts.type || "doughnut",
    data: {
      labels: entries.map(([k]) => k),
      datasets: [{
        data: entries.map(([, v]) => v),
        backgroundColor: entries.map((_, i) => PIE_PALETTE[i % PIE_PALETTE.length]),
        borderWidth: 2,
        borderColor: "#0E0E0E"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: opts.type === "pie" ? 0 : "58%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#0E0E0E", padding: 8, font: { size: 11, weight: 600 }, boxWidth: 14,
            generateLabels: chart => chart.data.labels.map((label, i) => {
              const val = chart.data.datasets[0].data[i];
              const pct = total ? ((val / total) * 100).toFixed(1) : 0;
              const short = label.length > 20 ? label.slice(0, 19) + "…" : label;
              return {
                text: `${short}  ${pct}%`,
                fillStyle: chart.data.datasets[0].backgroundColor[i],
                strokeStyle: chart.data.datasets[0].backgroundColor[i],
                index: i
              };
            })
          }
        },
        tooltip: {
          callbacks: {
            label: c => {
              const v = c.parsed;
              const pct = total ? ((v / total) * 100).toFixed(1) : 0;
              return `${c.label}: ${v.toLocaleString("zh-CN")} (${pct}%)`;
            }
          }
        }
      }
    }
  });
}

// ════════════════════════════════════════════════════════════
// DOM 元素
// ════════════════════════════════════════════════════════════

const els = {
  fileInput: document.getElementById("fileInput"),
  fileMeta:  document.getElementById("fileMeta"),
  dataStatus: document.getElementById("dataStatus"),
  kpiGrid:   document.getElementById("kpiGrid"),
  currencyButtons: document.querySelectorAll("[data-currency]"),

  modeTabs:    document.querySelectorAll(".mode-tab"),
  modeContents: document.querySelectorAll("[data-mode-content]"),
  modeInfos:   document.querySelectorAll("[data-mode-info]"),
  shopBadge:   document.getElementById("shopBadge"),
  affBadge:    document.getElementById("affBadge"),
  modeToast:   document.getElementById("modeToast"),
  modeToastText: document.getElementById("modeToastText"),
  modeToastClose: document.getElementById("modeToastClose"),

  drawer:    document.getElementById("orderDrawer"),
  drawerBody: document.getElementById("drawerBody"),

  // shop
  s: {
    aggregateSection: document.getElementById("aggregateSection"),
    productRankBody: document.getElementById("productRankBody"),
    searchInput: document.getElementById("searchInput"),
    statusFilter: document.getElementById("statusFilter"),
    channelFilter: document.getElementById("channelFilter"),
    sampleFilter: document.getElementById("sampleFilter"),
    productFilter: document.getElementById("productFilter"),
    provinceFilter: document.getElementById("provinceFilter"),
    dateFrom: document.getElementById("dateFrom"),
    dateTo: document.getElementById("dateTo"),
    resetFilters: document.getElementById("resetFilters"),
    exportBtn: document.getElementById("exportBtn"),
    filterMeta: document.getElementById("filterMeta"),
    sortSelect: document.getElementById("sortSelect"),
    orderTableBody: document.getElementById("orderTableBody"),
    pagination: document.getElementById("pagination")
  },

  // affiliate
  a: {
    aggregateSection: document.getElementById("affAggregateSection"),
    creatorRankBody: document.getElementById("creatorRankBody"),
    topContentBody: document.getElementById("topContentBody"),
    contentTypeBreakdown: document.getElementById("contentTypeBreakdown"),
    searchInput: document.getElementById("affSearchInput"),
    contentTypeFilter: document.getElementById("affContentTypeFilter"),
    statusFilter: document.getElementById("affStatusFilter"),
    refundFilter: document.getElementById("affRefundFilter"),
    creatorFilter: document.getElementById("affCreatorFilter"),
    dateFrom: document.getElementById("affDateFrom"),
    dateTo: document.getElementById("affDateTo"),
    resetFilters: document.getElementById("affResetFilters"),
    exportBtn: document.getElementById("affExportBtn"),
    filterMeta: document.getElementById("affFilterMeta"),
    sortSelect: document.getElementById("affSortSelect"),
    orderTableBody: document.getElementById("affOrderTableBody"),
    pagination: document.getElementById("affPagination")
  }
};

function updateCurrencyButtons() {
  els.currencyButtons.forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-currency") === displayCurrency);
  });
}

function rerenderCurrentMode() {
  const cur = state[state.mode];
  if (!cur.orders.length) return;
  if (state.mode === "shop") {
    shop.renderKPIs();
    shop.renderAggregates();
    shop.renderTable();
  } else {
    affiliate.renderKPIs();
    affiliate.renderAggregates();
    affiliate.renderTable();
  }
}

function setCurrency(next) {
  if (!next || next === displayCurrency) return;
  displayCurrency = next;
  localStorage.setItem("currency", displayCurrency);
  updateCurrencyButtons();
  rerenderCurrentMode();
}

els.currencyButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    setCurrency(btn.getAttribute("data-currency"));
  });
});
updateCurrencyButtons();

// ════════════════════════════════════════════════════════════
// 模式切换
// ════════════════════════════════════════════════════════════

function switchMode(newMode, opts = {}) {
  if (newMode !== "shop" && newMode !== "affiliate") return;
  state.mode = newMode;

  // 更新 tabs 高亮
  els.modeTabs.forEach(btn => {
    const active = btn.dataset.mode === newMode;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });

  // 内容显隐
  els.modeContents.forEach(el => {
    el.hidden = el.dataset.modeContent !== newMode;
  });

  // info 描述
  els.modeInfos.forEach(el => {
    el.hidden = el.dataset.modeInfo !== newMode;
  });

  // 根据当前模式重渲染 KPI（如果有数据）
  const cur = state[newMode];
  if (cur.orders.length) {
    if (newMode === "shop") { shop.renderKPIs(); shop.renderAggregates(); shop.applyFilters(); }
    else                    { affiliate.renderKPIs(); affiliate.renderAggregates(); affiliate.applyFilters(); }
    els.dataStatus.textContent = tt("status.loaded", { n: cur.orders.length }) || `已导入 ${cur.orders.length} 订单`;
  } else {
    els.kpiGrid.innerHTML = "";
    els.dataStatus.textContent = tt("status.wait") || "等待导入";
  }

  if (opts.toast) {
    showModeToast(opts.toast);
  } else {
    hideModeToast();
  }
}

function showModeToast(msg) {
  els.modeToastText.textContent = msg;
  els.modeToast.classList.add("show");
}
function hideModeToast() { els.modeToast.classList.remove("show"); }
els.modeToastClose.addEventListener("click", hideModeToast);

els.modeTabs.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.mode;
    if (target === state.mode) return;
    switchMode(target);
  });
});

// ════════════════════════════════════════════════════════════
// 文件上传
// ════════════════════════════════════════════════════════════

els.fileInput.addEventListener("change", async e => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const { headers, rows } = parseCSV(text);

    if (!rows.length) {
      alert("CSV 文件为空 / 解析失败，请检查文件");
      return;
    }

    const detectedMode = detectMode(headers);
    if (!detectedMode) {
      alert("无法识别该 CSV 类型。请确认是店铺订单或达人订单导出文件。");
      return;
    }

    if (detectedMode === "shop")      { shop.ingest(rows); }
    else                              { affiliate.ingest(rows); }

    els.fileMeta.textContent = `已导入 ${rows.length} 行 (${file.name})`;

    // badge 更新
    const sCount = state.shop.orders.length;
    const aCount = state.affiliate.orders.length;
    if (sCount) { els.shopBadge.hidden = false; els.shopBadge.textContent = sCount.toLocaleString(); }
    if (aCount) { els.affBadge.hidden = false;  els.affBadge.textContent  = aCount.toLocaleString(); }

    // 自动切到检测出的模式
    if (state.mode !== detectedMode) {
      const otherCount = state.mode === "shop" ? aCount : sCount;
      const msg = detectedMode === "affiliate"
        ? `检测到这是达人订单 · 已自动切换到达人模式（${rows.length} 条）`
        : `检测到这是店铺订单 · 已自动切换到店铺模式（${rows.length} 条）`;
      switchMode(detectedMode, { toast: msg });
    } else {
      // 同模式重新导入 → 也刷新一下 UI
      if (detectedMode === "shop") { shop.renderKPIs(); shop.renderAggregates(); shop.applyFilters(); }
      else                         { affiliate.renderKPIs(); affiliate.renderAggregates(); affiliate.applyFilters(); }
      els.dataStatus.textContent = `已导入 ${rows.length} 订单`;
      hideModeToast();
    }

  } catch (err) {
    console.error("CSV parsing error:", err);
    alert(`CSV 解析失败: ${err.message}`);
  }
});

// ════════════════════════════════════════════════════════════
// SHOP 模式
// ════════════════════════════════════════════════════════════

const shop = {

  isSample(o) {
    const amount = parseFloat(o["Order Amount"]) || 0;
    const payment = (o["Payment Method"] || "").trim();
    return amount === 0 && payment === "";
  },

  ingest(rows) {
    state.shop.orders = rows.map(r => ({
      ...r,
      _product:  getProductName(r["Seller SKU"]),
      _isSample: shop.isSample(r),
      _date:     parseDate(r["Created Time"])
    }));
    state.shop.filtered = [...state.shop.orders];
    state.shop.page = 1;

    // 省份下拉填充
    const provinces = [...new Set(state.shop.orders.map(o => o.Province).filter(Boolean))].sort();
    els.s.provinceFilter.innerHTML = `<option value="">${tt("order.filter.all") || "全部"}</option>`
      + provinces.map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join("");
  },

  renderKPIs() {
    const all = state.shop.orders;
    const paid = all.filter(o => !o._isSample);
    const samples = all.filter(o => o._isSample);

    const totalGMV = paid.reduce((s, o) => s + (parseFloat(o["Order Amount"]) || 0), 0);
    const canceled = paid.filter(o => o["Order Status"] === "Canceled").length;
    const cancelRate = paid.length ? canceled / paid.length * 100 : 0;
    const avg = paid.length ? totalGMV / paid.length : 0;
    const completedGMV = paid.filter(o => o["Order Status"] === "Completed")
      .reduce((s, o) => s + (parseFloat(o["Order Amount"]) || 0), 0);

    const kpis = [
      { label: tt("kpi.order.total")        || "总订单数",     value: all.length.toLocaleString(),     note: tt("note.order.total") || "包含寄样" },
      { label: tt("kpi.order.paid")         || "付费订单",     value: paid.length.toLocaleString(),    note: tt("note.order.paid")  || "排除寄样" },
      { label: tt("kpi.order.sample")       || "寄样订单",     value: samples.length.toLocaleString(), note: tt("note.order.sample") || "0元 + 无支付" },
      { label: tt("kpi.order.gmv")          || "总 GMV",       value: formatCurrency(totalGMV),        note: tt("note.order.gmv")    || "付费订单合计" },
      { label: tt("kpi.order.completed_gmv")|| "已完成 GMV",   value: formatCurrency(completedGMV),    note: tt("note.order.completed_gmv") || "Completed 状态" },
      { label: tt("kpi.order.cancel_rate")  || "取消率",       value: formatPercent(cancelRate),       note: tt("note.order.cancel_rate") || "Canceled / 付费" },
      { label: tt("kpi.order.avg")          || "客单价",       value: formatCurrency(avg),             note: tt("note.order.avg")    || "GMV / 订单" }
    ];
    els.kpiGrid.innerHTML = kpis.map(k => `
      <div class="kpi-card">
        <div class="kpi-title">${escapeHtml(k.label)}</div>
        <div class="kpi-value">${escapeHtml(k.value)}</div>
        <div class="kpi-note">${escapeHtml(k.note)}</div>
      </div>`).join("");
  },

  renderAggregates() {
    if (els.s.aggregateSection) els.s.aggregateSection.style.display = "";
    const paid = state.shop.orders.filter(o => !o._isSample);
    const samples = state.shop.orders.filter(o => o._isSample);

    shop.renderProductRanking(paid);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      shop.renderProvinceChart(paid);
      shop.renderStatusChart(paid);
      shop.renderTrendChart(paid);
      shop.renderCancelChart(paid);
      shop.renderSampleChart(samples);
    }));
  },

  renderProductRanking(paid) {
    const map = {};
    paid.forEach(o => {
      const p = o._product || o["Seller SKU"] || "未知";
      if (!map[p]) map[p] = { orders: 0, gmv: 0, canceled: 0 };
      map[p].orders++;
      map[p].gmv += parseFloat(o["Order Amount"]) || 0;
      if (o["Order Status"] === "Canceled") map[p].canceled++;
    });
    const ranked = Object.entries(map).sort((a, b) => b[1].orders - a[1].orders);
    els.s.productRankBody.innerHTML = ranked.map(([name, d], i) => {
      const cancelRate = d.orders ? (d.canceled / d.orders * 100) : 0;
      const cls = cancelRate > 50 ? "danger" : cancelRate > 30 ? "warning" : "ok";
      const rowCls = cancelRate > 50 ? "row-alert" : "";
      return `<tr class="${rowCls}">
        <td class="rank-num">${i + 1}</td>
        <td class="product-name">${escapeHtml(name)}</td>
        <td><strong>${d.orders}</strong></td>
        <td>${formatCurrency(d.gmv)}</td>
        <td><span class="cancel-rate rate-${cls}">${cancelRate.toFixed(1)}%</span></td>
      </tr>`;
    }).join("");
  },

  renderProvinceChart(paid) {
    const map = {};
    paid.forEach(o => { const p = o["Province"] || "未知"; map[p] = (map[p] || 0) + 1; });
    const top10 = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10).reverse();
    destroyChart("provinceChart");
    const ctx = document.getElementById("provinceChart");
    if (!ctx) return;
    chartInstances["provinceChart"] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: top10.map(([p]) => p),
        datasets: [{
          label: "订单数",
          data: top10.map(([, c]) => c),
          backgroundColor: "#FF7500",
          borderColor: "#0E0E0E",
          borderWidth: 1.5,
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: "y", responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `订单数: ${c.parsed.x}` } } },
        scales: {
          x: { ticks: { color: "#0E0E0E" }, grid: { color: "rgba(0,0,0,0.06)" } },
          y: { ticks: { color: "#0E0E0E", font: { size: 11, weight: 700 } }, grid: { display: false } }
        }
      }
    });
  },

  renderStatusChart(paid) {
    const map = {};
    paid.forEach(o => { const s = o["Order Status"] || "Unknown"; map[s] = (map[s] || 0) + 1; });
    const COLORS = {
      "Shipped":   "#62B89A",
      "Completed": "#2FB985",
      "Canceled":  "#F27A5C",
      "To ship":   "#FFD93D",
      "Unpaid":    "#A0A0A0"
    };
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    destroyChart("statusChart");
    const ctx = document.getElementById("statusChart");
    if (!ctx) return;
    const total = entries.reduce((s, [, c]) => s + c, 0);
    chartInstances["statusChart"] = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: entries.map(([s]) => s),
        datasets: [{
          data: entries.map(([, c]) => c),
          backgroundColor: entries.map(([s]) => COLORS[s] || "#A0A0A0"),
          borderWidth: 2,
          borderColor: "#0E0E0E"
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "58%",
        plugins: {
          legend: { position: "bottom", labels: { color: "#0E0E0E", padding: 8, font: { size: 12, weight: 600 }, boxWidth: 14 } },
          tooltip: { callbacks: { label: c => { const pct = total ? ((c.parsed / total) * 100).toFixed(1) : 0; return `${c.label}: ${c.parsed} (${pct}%)`; } } }
        }
      }
    });
  },

  renderTrendChart(paid) {
    const map = {};
    paid.forEach(o => {
      if (!o._date) return;
      const k = formatLocalDateKey(o._date);
      if (!map[k]) map[k] = { orders: 0, gmv: 0 };
      map[k].orders++;
      map[k].gmv += parseFloat(o["Order Amount"]) || 0;
    });
    const sorted = Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
    destroyChart("trendChart");
    const ctx = document.getElementById("trendChart");
    if (!ctx) return;
    chartInstances["trendChart"] = new Chart(ctx, {
      type: "line",
      data: {
        labels: sorted.map(([d]) => d.slice(5)),
        datasets: [
          { label: "订单数", data: sorted.map(([, v]) => v.orders),
            borderColor: "#FF7500", backgroundColor: "rgba(255,117,0,0.12)", fill: true,
            tension: 0.3, yAxisID: "yOrders", pointRadius: 2, pointHoverRadius: 5, borderWidth: 2.5 },
          { label: displayCurrency === "CNY" ? "GMV (CNY)" : "GMV (juta IDR)", data: sorted.map(([, v]) => displayCurrency === "CNY"
              ? +convertMoney(v.gmv).toFixed(2)
              : +(v.gmv / 1_000_000).toFixed(2)),
            borderColor: "#9A7BE8", backgroundColor: "rgba(154,123,232,0.10)", fill: true,
            tension: 0.3, yAxisID: "yGmv", pointRadius: 2, pointHoverRadius: 5, borderWidth: 2.5 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false, interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { labels: { color: "#0E0E0E", usePointStyle: true, font: { size: 12, weight: 700 } } },
          tooltip: { callbacks: { label: c => c.dataset.yAxisID === "yGmv"
            ? `GMV: ${displayCurrency === "CNY" ? formatCurrency(c.parsed.y, "CNY") : formatCurrency(c.parsed.y * 1_000_000)}`
            : `订单数: ${c.parsed.y}` } }
        },
        scales: {
          x: { ticks: { color: "#0E0E0E", maxTicksLimit: 14, font: { size: 11 } }, grid: { color: "rgba(0,0,0,0.04)" } },
          yOrders: { type: "linear", position: "left", beginAtZero: true,
            title: { display: true, text: "订单数", color: "#FF7500", font: { size: 11, weight: 700 } },
            ticks: { color: "#FF7500" }, grid: { color: "rgba(0,0,0,0.04)" } },
          yGmv: { type: "linear", position: "right", beginAtZero: true,
            title: { display: true, text: displayCurrency === "CNY" ? "GMV (CNY)" : "GMV (juta)", color: "#9A7BE8", font: { size: 11, weight: 700 } },
            ticks: { color: "#9A7BE8" }, grid: { display: false } }
        }
      }
    });
  },

  renderCancelChart(paid) {
    const canceled = paid.filter(o => o["Order Status"] === "Canceled");
    const map = {};
    canceled.forEach(o => { const r = translateCancelReason(o["Cancel Reason"]); map[r] = (map[r] || 0) + 1; });
    renderPieChart("cancelChart", Object.entries(map).sort((a, b) => b[1] - a[1]), { emptyText: "暂无取消订单" });
  },

  renderSampleChart(samples) {
    const map = {};
    samples.forEach(o => { const p = o._product || o["Seller SKU"] || "未知"; map[p] = (map[p] || 0) + 1; });
    renderPieChart("sampleChart", Object.entries(map).sort((a, b) => b[1] - a[1]), { emptyText: "暂无寄样订单" });
  },

  applyFilters() {
    const f = els.s;
    const search = f.searchInput.value.toLowerCase().trim();
    const status = f.statusFilter.value;
    const channel = f.channelFilter.value;
    const sample = f.sampleFilter.value;
    const product = f.productFilter.value.toLowerCase().trim();
    const province = f.provinceFilter.value;
    const from = f.dateFrom.value ? new Date(f.dateFrom.value) : null;
    const to = f.dateTo.value ? new Date(f.dateTo.value) : null;
    if (to) to.setHours(23, 59, 59, 999);

    state.shop.filtered = state.shop.orders.filter(o => {
      if (search && !(
        (o["Order ID"] || "").toLowerCase().includes(search) ||
        (o["Buyer Username"] || "").toLowerCase().includes(search) ||
        (o["Tracking ID"] || "").toLowerCase().includes(search)
      )) return false;
      if (status && o["Order Status"] !== status) return false;
      if (channel && o["Purchase Channel"] !== channel) return false;
      if (province && o["Province"] !== province) return false;
      if (sample === "paid" && o._isSample) return false;
      if (sample === "sample" && !o._isSample) return false;
      if (product && !o._product.toLowerCase().includes(product)) return false;
      if (from && (!o._date || o._date < from)) return false;
      if (to && (!o._date || o._date > to)) return false;
      return true;
    });
    state.shop.page = 1;
    shop.renderTable();
    f.filterMeta.textContent = `显示 ${state.shop.filtered.length} / ${state.shop.orders.length} 订单`;
  },

  renderTable() {
    const sorted = shop.getSorted();
    const start = (state.shop.page - 1) * PAGE_SIZE;
    const page = sorted.slice(start, start + PAGE_SIZE);

    els.s.orderTableBody.innerHTML = page.map((o, idx) => `
      <tr data-index="${start + idx}">
        <td class="order-id">${escapeHtml(o["Order ID"])}</td>
        <td>${formatDate(o._date)}</td>
        <td class="product-name">${escapeHtml(o._product)}</td>
        <td class="sku-cell">${escapeHtml(o["Seller SKU"])}</td>
        <td>${escapeHtml(o["Quantity"])}</td>
        <td class="amount-cell">${formatCurrency(o["Order Amount"])}</td>
        <td><span class="status-badge status-${escapeHtml((o["Order Status"] || "").toLowerCase().replace(/\s/g, "-"))}">${escapeHtml(o["Order Status"])}</span></td>
        <td>${escapeHtml(o["Purchase Channel"])}</td>
        <td>${escapeHtml(o["Province"])}</td>
        <td>${o._isSample ? '<span class="sample-badge">寄样</span>' : ""}</td>
      </tr>`).join("");

    shop.renderPagination(sorted.length);
  },

  getSorted() {
    const arr = [...state.shop.filtered];
    arr.sort((a, b) => {
      switch (els.s.sortSelect.value) {
        case "date_desc":   return (b._date || 0) - (a._date || 0);
        case "date_asc":    return (a._date || 0) - (b._date || 0);
        case "amount_desc": return (parseFloat(b["Order Amount"]) || 0) - (parseFloat(a["Order Amount"]) || 0);
        case "amount_asc":  return (parseFloat(a["Order Amount"]) || 0) - (parseFloat(b["Order Amount"]) || 0);
      }
      return 0;
    });
    return arr;
  },

  renderPagination(total) {
    renderPagination(els.s.pagination, total, state.shop.page, p => {
      state.shop.page = p; shop.renderTable();
    });
  },

  exportCSV() {
    if (!state.shop.filtered.length) { alert("没有可导出的订单"); return; }
    const headers = ["订单号", "下单时间", "产品名", "SKU", "数量", "订单金额", "状态", "渠道", "省份", "寄样"];
    const rows = state.shop.filtered.map(o => [
      o["Order ID"], o["Created Time"], o._product, o["Seller SKU"],
      o["Quantity"], o["Order Amount"], o["Order Status"], o["Purchase Channel"],
      o["Province"], o._isSample ? "是" : "否"
    ]);
    downloadCSV([headers, ...rows], `店铺订单_${formatLocalDateKey(new Date())}.csv`);
  },

  showDetail(order) {
    const fields = [
      { key: "Order ID", label: "订单号" },
      { key: "Order Status", label: "订单状态" },
      { key: "Order Substatus", label: "订单子状态" },
      { key: "Seller SKU", label: "SKU 编码" },
      { key: "_product", label: "产品名" },
      { key: "Product Name", label: "原始产品名" },
      { key: "Variation", label: "规格" },
      { key: "Quantity", label: "数量" },
      { key: "SKU Unit Original Price", label: "SKU 原价", format: formatCurrency },
      { key: "SKU Subtotal After Discount", label: "SKU 折后", format: formatCurrency },
      { key: "Order Amount", label: "订单总额", format: formatCurrency },
      { key: "Created Time", label: "下单时间" },
      { key: "Paid Time", label: "付款时间" },
      { key: "Shipped Time", label: "发货时间" },
      { key: "Delivered Time", label: "送达时间" },
      { key: "Tracking ID", label: "物流单号" },
      { key: "Shipping Provider Name", label: "物流商" },
      { key: "Delivery Option", label: "配送方式" },
      { key: "Purchase Channel", label: "购买渠道" },
      { key: "Payment Method", label: "支付方式" },
      { key: "Buyer Username", label: "买家用户名" },
      { key: "Recipient", label: "收件人" },
      { key: "Phone #", label: "电话" },
      { key: "Province", label: "省份" },
      { key: "Regency and City", label: "城市" },
      { key: "Districts", label: "区" },
      { key: "Detail Address", label: "详细地址" },
      { key: "_isSample", label: "是否寄样", format: v => v ? "是" : "否" }
    ];
    drawerRender(fields, order);
  }
};

// 事件委托：表格行点击 → 展开抽屉
els.s.orderTableBody.addEventListener("click", e => {
  const row = e.target.closest("tr"); if (!row) return;
  const idx = parseInt(row.dataset.index);
  const sorted = shop.getSorted();
  if (sorted[idx]) shop.showDetail(sorted[idx]);
});

// SHOP 筛选事件
els.s.searchInput.addEventListener("input", () => shop.applyFilters());
els.s.statusFilter.addEventListener("change", () => shop.applyFilters());
els.s.channelFilter.addEventListener("change", () => shop.applyFilters());
els.s.sampleFilter.addEventListener("change", () => shop.applyFilters());
els.s.productFilter.addEventListener("input", () => shop.applyFilters());
els.s.provinceFilter.addEventListener("change", () => shop.applyFilters());
els.s.dateFrom.addEventListener("change", () => shop.applyFilters());
els.s.dateTo.addEventListener("change", () => shop.applyFilters());
els.s.sortSelect.addEventListener("change", () => { state.shop.page = 1; shop.renderTable(); });
els.s.resetFilters.addEventListener("click", () => {
  els.s.searchInput.value = ""; els.s.statusFilter.value = ""; els.s.channelFilter.value = "";
  els.s.sampleFilter.value = ""; els.s.productFilter.value = ""; els.s.provinceFilter.value = "";
  els.s.dateFrom.value = ""; els.s.dateTo.value = ""; shop.applyFilters();
});
els.s.exportBtn.addEventListener("click", () => shop.exportCSV());

// ════════════════════════════════════════════════════════════
// AFFILIATE 模式
// ════════════════════════════════════════════════════════════

const affiliate = {

  // 单条订单的总实际佣金（标准 + Shop Ads + co-funded bonus）
  totalCommission(o) {
    return (parseFloat(o["Actual Commission Payment"]) || 0)
         + (parseFloat(o["Actual Shop Ads commission payment"]) || 0)
         + (parseFloat(o["Actual co-funded creator bonus"]) || 0);
  },

  ingest(rows) {
    state.affiliate.orders = rows.map(r => ({
      ...r,
      _product: getProductName(r["SKU ID"]) || r["Product Name"] || "",
      _date: parseDate(r["Time Created"]),
      _payment: parseFloat(r["Payment Amount"]) || 0,
      _commissionRate: parseFloat(String(r["Standard commission rate"]).replace(/%/g, "")) || 0,
      _commissionActual: affiliate.totalCommission(r),
      _refunded: (r["Fully returned or refunded"] || "").toLowerCase() === "yes",
      _contentType: r["Content Type"] || "Other"
    }));
    state.affiliate.filtered = [...state.affiliate.orders];
    state.affiliate.page = 1;

    // 动态填充筛选下拉
    const types = [...new Set(state.affiliate.orders.map(o => o._contentType).filter(Boolean))].sort();
    els.a.contentTypeFilter.innerHTML = `<option value="">${tt("order.filter.all") || "全部"}</option>`
      + types.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("");

    const statuses = [...new Set(state.affiliate.orders.map(o => o["Order Status"]).filter(Boolean))].sort();
    els.a.statusFilter.innerHTML = `<option value="">${tt("order.filter.all") || "全部"}</option>`
      + statuses.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("");

    const creators = [...new Set(state.affiliate.orders.map(o => o["Creator Username"]).filter(Boolean))].sort();
    els.a.creatorFilter.innerHTML = `<option value="">${tt("order.filter.all") || "全部"}（${creators.length}）</option>`
      + creators.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  },

  renderKPIs() {
    const all = state.affiliate.orders;
    const totalOrders = all.length;
    const creators = new Set(all.map(o => o["Creator Username"]).filter(Boolean));
    const contents = new Set(all.map(o => o["Content ID"]).filter(Boolean));
    const totalGMV = all.reduce((s, o) => s + o._payment, 0);
    const totalCommission = all.reduce((s, o) => s + o._commissionActual, 0);
    const avgRate = totalGMV ? totalCommission / totalGMV * 100 : 0;
    const refunded = all.filter(o => o._refunded).length;
    const refundRate = totalOrders ? refunded / totalOrders * 100 : 0;

    const kpis = [
      { label: tt("kpi.aff.total")     || "总订单数",  value: totalOrders.toLocaleString(),  note: tt("note.aff.total") || "达人后台明细" },
      { label: tt("kpi.aff.creators")  || "涉及达人",  value: creators.size.toLocaleString(), note: tt("note.aff.creators") || "去重达人数" },
      { label: tt("kpi.aff.contents")  || "涉及内容",  value: contents.size.toLocaleString(), note: tt("note.aff.contents") || "去重 Content ID" },
      { label: tt("kpi.aff.gmv")       || "总 GMV",    value: formatCurrency(totalGMV),       note: tt("note.aff.gmv") || "Payment 合计" },
      { label: tt("kpi.aff.commission")|| "佣金成本",  value: formatCurrency(totalCommission),note: tt("note.aff.commission") || "标准+Ads+Bonus" },
      { label: tt("kpi.aff.avg_rate")  || "平均佣金率",value: formatPercent(avgRate),         note: tt("note.aff.avg_rate") || "佣金/GMV" },
      { label: tt("kpi.aff.refund_rate")|| "退货率",   value: formatPercent(refundRate),      note: tt("note.aff.refund_rate") || "Returned/Refunded" }
    ];
    els.kpiGrid.innerHTML = kpis.map(k => `
      <div class="kpi-card">
        <div class="kpi-title">${escapeHtml(k.label)}</div>
        <div class="kpi-value">${escapeHtml(k.value)}</div>
        <div class="kpi-note">${escapeHtml(k.note)}</div>
      </div>`).join("");
  },

  renderAggregates() {
    if (els.a.aggregateSection) els.a.aggregateSection.style.display = "";
    affiliate.renderCreatorRanking();
    affiliate.renderTopContent();
    affiliate.renderContentTypeBreakdown();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      affiliate.renderContentTypeChart();
      affiliate.renderCommissionMixChart();
      affiliate.renderTrendChart();
    }));
  },

  // 各内容类型的详细分解（订单/去重/GMV/佣金）
  renderContentTypeBreakdown() {
    const TYPE_META = {
      "Video":                    { icon: "🎬", label: "Video",          cls: "ct-Video" },
      "Showcase":                 { icon: "🛍️", label: "Showcase",       cls: "ct-Showcase" },
      "Livestream":               { icon: "🔴", label: "Livestream",     cls: "ct-Livestream" },
      "External Traffic Program": { icon: "🌐", label: "External",       cls: "ct-External" }
    };
    const map = {};
    state.affiliate.orders.forEach(o => {
      const t = o._contentType || "Other";
      if (!map[t]) map[t] = { orders: 0, ids: new Set(), gmv: 0, commission: 0 };
      map[t].orders++;
      if (o["Content ID"]) map[t].ids.add(o["Content ID"]);
      map[t].gmv += o._payment;
      map[t].commission += o._commissionActual;
    });

    const totalOrders = state.affiliate.orders.length;
    const sorted = Object.entries(map).sort((a, b) => b[1].orders - a[1].orders);
    if (!sorted.length) {
      els.a.contentTypeBreakdown.innerHTML = `<div class="ct-empty">暂无内容数据</div>`;
      return;
    }

    els.a.contentTypeBreakdown.innerHTML = sorted.map(([type, d]) => {
      const meta = TYPE_META[type] || { icon: "📄", label: type, cls: "ct-Other" };
      const pct = totalOrders ? (d.orders / totalOrders * 100) : 0;
      const rate = d.gmv ? (d.commission / d.gmv * 100) : 0;
      return `<div class="ct-card ${meta.cls}">
        <div class="ct-card-head">
          <span class="ct-icon">${meta.icon}</span>
          <span class="ct-name">${escapeHtml(meta.label)}</span>
          <span class="ct-pct">${pct.toFixed(1)}%</span>
        </div>
        <div class="ct-stats">
          <div class="ct-stat"><div class="ct-stat-v">${d.orders.toLocaleString()}</div><div class="ct-stat-l">订单</div></div>
          <div class="ct-stat"><div class="ct-stat-v">${d.ids.size.toLocaleString()}</div><div class="ct-stat-l">去重内容</div></div>
          <div class="ct-stat"><div class="ct-stat-v" title="${formatCurrency(d.gmv)}">${formatJuta(d.gmv)}</div><div class="ct-stat-l">GMV</div></div>
        </div>
        <div class="ct-foot">
          <span>佣金 <strong>${formatJuta(d.commission)}</strong></span>
          <span>佣金率 <strong>${rate.toFixed(2)}%</strong></span>
        </div>
      </div>`;
    }).join("");
  },

  renderCreatorRanking() {
    const map = {};
    state.affiliate.orders.forEach(o => {
      const c = o["Creator Username"] || "(未知)";
      if (!map[c]) map[c] = { orders: 0, gmv: 0, commission: 0, refunded: 0 };
      map[c].orders++;
      map[c].gmv += o._payment;
      map[c].commission += o._commissionActual;
      if (o._refunded) map[c].refunded++;
    });
    const ranked = Object.entries(map).sort((a, b) => b[1].gmv - a[1].gmv).slice(0, 50);
    els.a.creatorRankBody.innerHTML = ranked.map(([name, d], i) => {
      const aov = d.orders ? d.gmv / d.orders : 0;
      const rr = d.orders ? d.refunded / d.orders * 100 : 0;
      const rrCls = rr > 30 ? "danger" : rr > 15 ? "warning" : "ok";
      return `<tr>
        <td class="rank-num">${i + 1}</td>
        <td><span class="creator-name">@${escapeHtml(name)}</span></td>
        <td><strong>${d.orders}</strong></td>
        <td>${formatCurrency(d.gmv)}</td>
        <td>${formatCurrency(d.commission)}</td>
        <td>${formatCurrency(aov)}</td>
        <td><span class="cancel-rate rate-${rrCls}">${rr.toFixed(1)}%</span></td>
      </tr>`;
    }).join("");
  },

  renderContentTypeChart() {
    const map = {};
    state.affiliate.orders.forEach(o => {
      const t = o._contentType || "Other";
      map[t] = (map[t] || 0) + 1;
    });
    renderPieChart("contentTypeChart", Object.entries(map).sort((a, b) => b[1] - a[1]), { emptyText: "暂无内容类型数据" });
  },

  renderTopContent() {
    const map = {};
    state.affiliate.orders.forEach(o => {
      const id = o["Content ID"] || "(直接进店)";
      if (!map[id]) map[id] = { orders: 0, gmv: 0, type: o._contentType, creator: o["Creator Username"] || "" };
      map[id].orders++;
      map[id].gmv += o._payment;
    });
    const top = Object.entries(map).sort((a, b) => b[1].orders - a[1].orders).slice(0, 10);
    els.a.topContentBody.innerHTML = top.map(([id, d], i) => {
      const shortId = id.length > 18 ? id.slice(0, 8) + "…" + id.slice(-6) : id;
      const url = getContentURL(id, d.creator, d.type);
      const idCell = url
        ? `<a class="tt-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(id)} · 在新标签页打开">${escapeHtml(shortId)}</a>`
        : `<span class="tt-link tt-link-disabled" title="${escapeHtml(id)}">${escapeHtml(shortId)}</span>`;
      return `<tr>
        <td class="rank-num">${i + 1}</td>
        <td>${idCell}</td>
        <td><span class="content-type-badge content-type-${contentTypeSlug(d.type)}">${escapeHtml(d.type || "—")}</span></td>
        <td>${d.creator ? `<span class="creator-name">@${escapeHtml(d.creator)}</span>` : "—"}</td>
        <td><strong>${d.orders}</strong></td>
        <td>${formatCurrency(d.gmv)}</td>
      </tr>`;
    }).join("");
  },

  renderCommissionMixChart() {
    let std = 0, ads = 0, bonus = 0;
    state.affiliate.orders.forEach(o => {
      std   += parseFloat(o["Actual Commission Payment"]) || 0;
      ads   += parseFloat(o["Actual Shop Ads commission payment"]) || 0;
      bonus += parseFloat(o["Actual co-funded creator bonus"]) || 0;
    });
    const entries = [
      ["标准佣金", std],
      ["Shop Ads", ads],
      ["Co-funded Bonus", bonus]
    ].filter(([, v]) => v > 0);
    renderPieChart("commissionMixChart", entries, { type: "pie", emptyText: "暂无佣金支付" });
  },

  renderTrendChart() {
    const map = {};
    state.affiliate.orders.forEach(o => {
      if (!o._date) return;
      const k = formatLocalDateKey(o._date);
      if (!map[k]) map[k] = { orders: 0, gmv: 0, commission: 0 };
      map[k].orders++;
      map[k].gmv += o._payment;
      map[k].commission += o._commissionActual;
    });
    const sorted = Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
    destroyChart("affTrendChart");
    const ctx = document.getElementById("affTrendChart");
    if (!ctx) return;
    chartInstances["affTrendChart"] = new Chart(ctx, {
      type: "line",
      data: {
        labels: sorted.map(([d]) => d.slice(5)),
        datasets: [
          { label: "订单数", data: sorted.map(([, v]) => v.orders),
            borderColor: "#FF7500", backgroundColor: "rgba(255,117,0,0.10)", fill: true,
            tension: 0.3, yAxisID: "yOrders", pointRadius: 2, pointHoverRadius: 5, borderWidth: 2.5 },
          { label: displayCurrency === "CNY" ? "GMV (CNY)" : "GMV (juta IDR)", data: sorted.map(([, v]) => displayCurrency === "CNY"
              ? +convertMoney(v.gmv).toFixed(2)
              : +(v.gmv / 1_000_000).toFixed(2)),
            borderColor: "#9A7BE8", backgroundColor: "rgba(154,123,232,0.10)", fill: true,
            tension: 0.3, yAxisID: "yGmv", pointRadius: 2, pointHoverRadius: 5, borderWidth: 2.5 },
          { label: displayCurrency === "CNY" ? "佣金 (CNY)" : "佣金 (ribu IDR)", data: sorted.map(([, v]) => displayCurrency === "CNY"
              ? +convertMoney(v.commission).toFixed(2)
              : +(v.commission / 1_000).toFixed(2)),
            borderColor: "#2FB985", backgroundColor: "rgba(47,185,133,0.08)", fill: true,
            tension: 0.3, yAxisID: "yCom", pointRadius: 2, pointHoverRadius: 5, borderWidth: 2.5, borderDash: [4, 3] }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false, interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { labels: { color: "#0E0E0E", usePointStyle: true, font: { size: 12, weight: 700 } } },
          tooltip: { callbacks: { label: c => {
            if (c.dataset.yAxisID === "yGmv") return `GMV: ${displayCurrency === "CNY" ? formatCurrency(c.parsed.y, "CNY") : formatCurrency(c.parsed.y * 1_000_000)}`;
            if (c.dataset.yAxisID === "yCom") return `佣金: ${displayCurrency === "CNY" ? formatCurrency(c.parsed.y, "CNY") : formatCurrency(c.parsed.y * 1_000)}`;
            return `订单数: ${c.parsed.y}`;
          } } }
        },
        scales: {
          x: { ticks: { color: "#0E0E0E", maxTicksLimit: 14, font: { size: 11 } }, grid: { color: "rgba(0,0,0,0.04)" } },
          yOrders: { type: "linear", position: "left", beginAtZero: true,
            title: { display: true, text: "订单数", color: "#FF7500", font: { size: 11, weight: 700 } },
            ticks: { color: "#FF7500" }, grid: { color: "rgba(0,0,0,0.04)" } },
          yGmv: { type: "linear", position: "right", beginAtZero: true,
            title: { display: true, text: displayCurrency === "CNY" ? "GMV (CNY)" : "GMV (juta)", color: "#9A7BE8", font: { size: 11, weight: 700 } },
            ticks: { color: "#9A7BE8" }, grid: { display: false } },
          yCom: { type: "linear", position: "right", beginAtZero: true, display: false }
        }
      }
    });
  },

  applyFilters() {
    const f = els.a;
    const search = f.searchInput.value.toLowerCase().trim();
    const ct = f.contentTypeFilter.value;
    const status = f.statusFilter.value;
    const refund = f.refundFilter.value;
    const creator = f.creatorFilter.value;
    const from = f.dateFrom.value ? new Date(f.dateFrom.value) : null;
    const to = f.dateTo.value ? new Date(f.dateTo.value) : null;
    if (to) to.setHours(23, 59, 59, 999);

    state.affiliate.filtered = state.affiliate.orders.filter(o => {
      if (search && !(
        (o["Order ID"] || "").toLowerCase().includes(search) ||
        (o["Creator Username"] || "").toLowerCase().includes(search) ||
        (o["Content ID"] || "").toLowerCase().includes(search)
      )) return false;
      if (ct && o._contentType !== ct) return false;
      if (status && o["Order Status"] !== status) return false;
      if (refund === "yes" && !o._refunded) return false;
      if (refund === "no" && o._refunded) return false;
      if (creator && o["Creator Username"] !== creator) return false;
      if (from && (!o._date || o._date < from)) return false;
      if (to && (!o._date || o._date > to)) return false;
      return true;
    });
    state.affiliate.page = 1;
    affiliate.renderTable();
    f.filterMeta.textContent = `显示 ${state.affiliate.filtered.length} / ${state.affiliate.orders.length} 订单`;
  },

  renderTable() {
    const sorted = affiliate.getSorted();
    const start = (state.affiliate.page - 1) * PAGE_SIZE;
    const page = sorted.slice(start, start + PAGE_SIZE);

    els.a.orderTableBody.innerHTML = page.map((o, idx) => `
      <tr data-index="${start + idx}">
        <td class="order-id">${escapeHtml(o["Order ID"])}</td>
        <td>${formatDate(o._date)}</td>
        <td><span class="creator-name">@${escapeHtml(o["Creator Username"])}</span></td>
        <td><span class="content-type-badge content-type-${contentTypeSlug(o._contentType)}">${escapeHtml(o._contentType || "—")}</span></td>
        <td class="product-name">${escapeHtml(o._product)}</td>
        <td>${escapeHtml(o["Quantity"])}</td>
        <td class="amount-cell">${formatCurrency(o._payment)}</td>
        <td><span class="status-badge status-${escapeHtml((o["Order Status"] || "").toLowerCase().replace(/\s/g, "-"))}">${escapeHtml(o["Order Status"])}</span></td>
        <td><span class="commission-rate">${escapeHtml(o["Standard commission rate"] || "—")}</span></td>
        <td class="amount-cell">${formatCurrency(o._commissionActual)}</td>
      </tr>`).join("");

    affiliate.renderPagination(sorted.length);
  },

  getSorted() {
    const arr = [...state.affiliate.filtered];
    arr.sort((a, b) => {
      switch (els.a.sortSelect.value) {
        case "date_desc":       return (b._date || 0) - (a._date || 0);
        case "date_asc":        return (a._date || 0) - (b._date || 0);
        case "payment_desc":    return b._payment - a._payment;
        case "commission_desc": return b._commissionActual - a._commissionActual;
      }
      return 0;
    });
    return arr;
  },

  renderPagination(total) {
    renderPagination(els.a.pagination, total, state.affiliate.page, p => {
      state.affiliate.page = p; affiliate.renderTable();
    });
  },

  exportCSV() {
    if (!state.affiliate.filtered.length) { alert("没有可导出的订单"); return; }
    const headers = ["订单号", "下单时间", "达人", "内容类型", "Content ID", "产品", "SKU", "数量", "Payment", "状态", "佣金率", "实际佣金", "退货"];
    const rows = state.affiliate.filtered.map(o => [
      o["Order ID"], o["Time Created"], o["Creator Username"], o._contentType, o["Content ID"],
      o._product, o["SKU ID"], o["Quantity"], o["Payment Amount"], o["Order Status"],
      o["Standard commission rate"], o._commissionActual, o._refunded ? "是" : "否"
    ]);
    downloadCSV([headers, ...rows], `达人订单_${formatLocalDateKey(new Date())}.csv`);
  },

  showDetail(order) {
    const groups = [
      { title: "订单", fields: [
        { key: "Order ID", label: "订单号" },
        { key: "Order Status", label: "状态" },
        { key: "Time Created", label: "下单时间" },
        { key: "Payment time", label: "付款时间" },
        { key: "Order Delivery Time", label: "送达时间" },
        { key: "Quantity", label: "数量" },
        { key: "Payment Amount", label: "Payment", format: formatCurrency },
        { key: "Price", label: "价格", format: formatCurrency },
        { key: "Currency", label: "币种" },
        { key: "Payment method", label: "支付方式" },
        { key: "Fully returned or refunded", label: "是否退货" },
        { key: "Platform", label: "平台" }
      ]},
      { title: "产品", fields: [
        { key: "Product ID", label: "Product ID" },
        { key: "Product Name", label: "产品名（原始）" },
        { key: "_product", label: "产品名（映射）" },
        { key: "SKU ID", label: "SKU ID" }
      ]},
      { title: "达人 / 内容", fields: [
        { key: "Creator Username", label: "达人用户名" },
        { key: "Content Type", label: "内容类型" },
        { key: "Content ID", label: "Content ID" }
      ]},
      { title: "佣金", fields: [
        { key: "commission model", label: "佣金模式" },
        { key: "Standard commission rate", label: "标准佣金率" },
        { key: "Est. Commission Base", label: "估算佣金基数", format: formatCurrency },
        { key: "Est. standard commission payment", label: "估算标准佣金", format: formatCurrency },
        { key: "Actual Commission Base", label: "实际佣金基数", format: formatCurrency },
        { key: "Actual Commission Payment", label: "实际标准佣金", format: formatCurrency },
        { key: "Shop Ads commission rate", label: "Shop Ads 佣金率" },
        { key: "Est. Shop Ads commission payment", label: "估算 Shop Ads 佣金", format: formatCurrency },
        { key: "Actual Shop Ads commission payment", label: "实际 Shop Ads 佣金", format: formatCurrency },
        { key: "Est. co-funded creator bonus", label: "估算 Co-funded Bonus", format: formatCurrency },
        { key: "Actual co-funded creator bonus", label: "实际 Co-funded Bonus", format: formatCurrency },
        { key: "Time Commission Paid", label: "佣金支付时间" }
      ]}
    ];
    drawerRenderGroups(groups, order);
  }
};

// AFFILIATE 表格事件委托
els.a.orderTableBody.addEventListener("click", e => {
  const row = e.target.closest("tr"); if (!row) return;
  const idx = parseInt(row.dataset.index);
  const sorted = affiliate.getSorted();
  if (sorted[idx]) affiliate.showDetail(sorted[idx]);
});

// AFFILIATE 筛选事件
els.a.searchInput.addEventListener("input", () => affiliate.applyFilters());
els.a.contentTypeFilter.addEventListener("change", () => affiliate.applyFilters());
els.a.statusFilter.addEventListener("change", () => affiliate.applyFilters());
els.a.refundFilter.addEventListener("change", () => affiliate.applyFilters());
els.a.creatorFilter.addEventListener("change", () => affiliate.applyFilters());
els.a.dateFrom.addEventListener("change", () => affiliate.applyFilters());
els.a.dateTo.addEventListener("change", () => affiliate.applyFilters());
els.a.sortSelect.addEventListener("change", () => { state.affiliate.page = 1; affiliate.renderTable(); });
els.a.resetFilters.addEventListener("click", () => {
  els.a.searchInput.value = ""; els.a.contentTypeFilter.value = ""; els.a.statusFilter.value = "";
  els.a.refundFilter.value = ""; els.a.creatorFilter.value = "";
  els.a.dateFrom.value = ""; els.a.dateTo.value = ""; affiliate.applyFilters();
});
els.a.exportBtn.addEventListener("click", () => affiliate.exportCSV());

// ════════════════════════════════════════════════════════════
// 通用 · 分页 / 抽屉 / 导出
// ════════════════════════════════════════════════════════════

function renderPagination(container, total, currentPage, onJump) {
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (totalPages <= 1) { container.innerHTML = ""; return; }

  const buttons = [];
  buttons.push(`<button class="page-btn" data-page="1" ${currentPage === 1 ? "disabled" : ""}>&laquo;</button>`);
  let lastPushed = null;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      buttons.push(`<button class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`);
      lastPushed = i;
    } else if (lastPushed !== "...") {
      buttons.push('<span class="page-ellipsis">...</span>');
      lastPushed = "...";
    }
  }
  buttons.push(`<button class="page-btn" data-page="${totalPages}" ${currentPage === totalPages ? "disabled" : ""}>&raquo;</button>`);
  container.innerHTML = buttons.join("");

  container.querySelectorAll(".page-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = parseInt(btn.dataset.page);
      if (!isNaN(p) && p !== currentPage) onJump(p);
    });
  });
}

function drawerRender(fields, order) {
  els.drawerBody.innerHTML = fields.map(f => {
    const v = order[f.key];
    const display = f.format ? f.format(v) : escapeHtml(v || "—");
    return `<div class="detail-row">
      <div class="detail-label">${escapeHtml(f.label)}</div>
      <div class="detail-value">${display}</div>
    </div>`;
  }).join("");
  els.drawer.classList.add("open");
}

function drawerRenderGroups(groups, order) {
  els.drawerBody.innerHTML = groups.map(g => `
    <div class="detail-group-title">${escapeHtml(g.title)}</div>
    ${g.fields.map(f => {
      const v = order[f.key];
      const display = f.format ? f.format(v) : escapeHtml(v || "—");
      return `<div class="detail-row">
        <div class="detail-label">${escapeHtml(f.label)}</div>
        <div class="detail-value">${display}</div>
      </div>`;
    }).join("")}
  `).join("");
  els.drawer.classList.add("open");
}

els.drawer.querySelector(".drawer-close").addEventListener("click", () => els.drawer.classList.remove("open"));
els.drawer.querySelector(".drawer-overlay").addEventListener("click", () => els.drawer.classList.remove("open"));

function downloadCSV(rows, filename) {
  const csv = rows.map(row => row.map(cell => {
    const s = String(cell ?? "").replace(/"/g, '""');
    return `"${s}"`;
  }).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

// 回到顶部
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > 300);
});
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// 语言切换时重渲染（i18n 已经触发 langchange）
document.addEventListener("langchange", () => {
  if (state[state.mode].orders.length) {
    rerenderCurrentMode();
  }
});
