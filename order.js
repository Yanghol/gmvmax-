// DOM elements
const fileInput = document.getElementById("fileInput");
const fileMeta = document.getElementById("fileMeta");
const dataStatus = document.getElementById("dataStatus");
const kpiGrid = document.getElementById("kpiGrid");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const channelFilter = document.getElementById("channelFilter");
const sampleFilter = document.getElementById("sampleFilter");
const productFilter = document.getElementById("productFilter");
const provinceFilter = document.getElementById("provinceFilter");
const dateFrom = document.getElementById("dateFrom");
const dateTo = document.getElementById("dateTo");
const resetFilters = document.getElementById("resetFilters");
const exportBtn = document.getElementById("exportBtn");
const filterMeta = document.getElementById("filterMeta");
const sortSelect = document.getElementById("sortSelect");
const orderTableBody = document.getElementById("orderTableBody");
const pagination = document.getElementById("pagination");
const orderDrawer = document.getElementById("orderDrawer");
const drawerBody = document.getElementById("drawerBody");

// Helper for translations
const tt = (key, vars) => {
  if (typeof window.t === "function") return window.t(key, vars);
  let text = key;
  if (vars) {
    Object.keys(vars).forEach(k => {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), vars[k]);
    });
  }
  return text;
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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Check dependencies
if (typeof XLSX === "undefined") {
  const banner = document.createElement("div");
  banner.className = "lib-warning";
  banner.textContent = "XLSX library not loaded. Please check your network connection.";
  document.body.prepend(banner);
  console.error("XLSX library not loaded!");
} else {
}

// State
let allOrders = [];
let filteredOrders = [];
let currentPage = 1;
const pageSize = 50;

// SKU → Product Name Mapping
const SKU_MAPPING = {
  "8995107505263": "洁面慕斯",
  "8995107505270": "润肤乳",
  "8995107505256": "冰沙霜",
  "8995107505294": "冰沙霜小样",
  "8995107505287": "润肤乳小样",
  "5263*2+5294*1": "洁面慕斯*2+冰沙霜小样",
  "5263*2+5287*1": "洁面慕斯*2+润肤乳小样",
  "5270*2+5294*1": "润肤乳*2+冰沙霜小样",
  "5256*2+5287*1": "冰沙霜*2+润肤乳小样",
  "5263*1+5270*1+5294*1": "洁面慕斯+润肤乳+冰沙霜小样",
  "5263*1+5256*1+5287*1": "洁面慕斯+冰沙霜+润肤乳小样",
  "5263*1+5270*1+5256*1+5294*1+5256*1": "洁面慕斯+冰沙霜+润肤乳（赠小样）",
  "5263*2+5270*3+5256*2": "【敏感肌套装】洁面慕斯2+冰沙霜2+润肤乳3",
  "5263*1+5270*1+5256*3": "【防晒套装】洁面慕斯1+冰沙霜3+润肤乳1",
  "5263*3+5270*1+5256*2": "【运动套装】洁面慕斯3+冰沙霜2+润肤乳1",
  "5263*3+5270*4+5256*2": "【家庭套装】洁面慕斯3+冰沙霜2+润肤乳4",
  "5263*3+5270*3+5256*2": "【户外套装】洁面慕斯3+冰沙霜2+润肤乳3",
  "5294*1+5287*1": "【旅行套装】冰沙霜小样+润肤乳小样",
  "8990144000016": "防晒乳",
  "0016*2": "防晒乳*2",
  "0016*3": "防晒乳*3",
  "0016*1+5256*1": "防晒+冰沙霜",
  "0016*1+5263*1": "防晒+洁面",
  "0016*1+5270*1": "防晒+润肤乳",
  "0016*1+5263*1+5270*1": "防晒+洁面+润肤乳",
  "0016*1+5256*1+5263*1+5270*1": "防晒+冰沙霜+洁面+润肤乳",
  "0016*2+5256*1": "防晒2+冰沙霜",
  "0016*2+5263*1+5270*1": "防晒2+洁面+润肤乳",
  "0016*3+5263*1+5270*2": "防晒3+洁面+润肤乳2",
  "5263*1+5270*1+5256*1": "慕斯+乳+冰沙霜" // Missing from price library but top seller
};

// Normalize SKU for order-agnostic matching
function normalizeSku(sku) {
  if (!sku) return "";
  const cleaned = sku.trim().replace(/\n/g, "").replace(/\s+/g, "");
  // Sort components: split by +, sort, rejoin
  const parts = cleaned.split("+").map(p => p.trim()).filter(Boolean);
  return parts.sort().join("+");
}

// Get product name from SKU
function getProductName(sku) {
  if (!sku) return "";
  const cleaned = sku.trim();

  // Direct match
  if (SKU_MAPPING[cleaned]) return SKU_MAPPING[cleaned];

  // Try normalized (order-agnostic)
  const normalized = normalizeSku(cleaned);
  for (const [mappedSku, name] of Object.entries(SKU_MAPPING)) {
    if (normalizeSku(mappedSku) === normalized) return name;
  }

  // Fuzzy fallbacks
  if (cleaned.match(/^00016/)) return getProductName(cleaned.replace(/^00016/, "0016"));
  if (cleaned === "8990144000016*2") return "防晒乳*2";

  // Return original SKU if no match
  return cleaned;
}

// Parse date DD/MM/YYYY HH:MM:SS
function parseDate(str) {
  if (!str || !str.trim()) return null;
  const match = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return null;
  const [, day, month, year] = match;
  return new Date(year, month - 1, day);
}

// Format date for display
function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("zh-CN");
}

// Format currency (IDR)
function formatCurrency(value) {
  if (!value || isNaN(value)) return "0 IDR";
  return `${Number(value).toLocaleString("zh-CN", { maximumFractionDigits: 0 })} IDR`;
}

// Check if order is a sample (0 amount + no payment method)
function isSample(order) {
  const amount = parseFloat(order["Order Amount"]) || 0;
  const payment = (order["Payment Method"] || "").trim();
  return amount === 0 && payment === "";
}

// Parse CSV
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;


  try {
    const text = await file.text();

    const workbook = XLSX.read(text, { type: "string", raw: true });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });


    if (!rows.length) {
      alert("CSV文件为空");
      return;
    }

    // Enrich data
    allOrders = rows.map(r => ({
      ...r,
      _product: getProductName(r["Seller SKU"]),
      _isSample: isSample(r),
      _date: parseDate(r["Created Time"])
    }));

    filteredOrders = [...allOrders];

    // Update UI
    fileMeta.textContent = `已导入 ${allOrders.length} 行订单数据`;
    dataStatus.textContent = `已导入 ${allOrders.length} 订单`;

    // Populate province filter
    const provinces = [...new Set(allOrders.map(o => o.Province).filter(Boolean))].sort();
    provinceFilter.innerHTML = '<option value="">全部</option>';
    provinces.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      provinceFilter.appendChild(opt);
    });


    renderKPIs();
    renderAggregates();
    applyFilters();
  } catch (err) {
    console.error("CSV parsing error:", err);
    alert(`CSV解析失败: ${err.message}\n\n请检查控制台查看详细错误`);
  }
});

// Calculate KPIs
function renderKPIs() {
  const paidOrders = allOrders.filter(o => !o._isSample);
  const samples = allOrders.filter(o => o._isSample);

  const totalOrders = allOrders.length;
  const paidCount = paidOrders.length;
  const sampleCount = samples.length;

  const totalGMV = paidOrders.reduce((sum, o) => sum + (parseFloat(o["Order Amount"]) || 0), 0);
  const canceledCount = paidOrders.filter(o => o["Order Status"] === "Canceled").length;
  const cancelRate = paidCount > 0 ? (canceledCount / paidCount) * 100 : 0;
  const avgOrder = paidCount > 0 ? totalGMV / paidCount : 0;

  const completedGMV = paidOrders
    .filter(o => o["Order Status"] === "Completed")
    .reduce((sum, o) => sum + (parseFloat(o["Order Amount"]) || 0), 0);

  const kpis = [
    { label: tt("kpi.order.total"), value: totalOrders.toLocaleString(), note: tt("note.order.total") },
    { label: tt("kpi.order.paid"), value: paidCount.toLocaleString(), note: tt("note.order.paid") },
    { label: tt("kpi.order.sample"), value: sampleCount.toLocaleString(), note: tt("note.order.sample") },
    { label: tt("kpi.order.gmv"), value: formatCurrency(totalGMV), note: tt("note.order.gmv") },
    { label: tt("kpi.order.completed_gmv"), value: formatCurrency(completedGMV), note: tt("note.order.completed_gmv") },
    { label: tt("kpi.order.cancel_rate"), value: `${cancelRate.toFixed(2)}%`, note: tt("note.order.cancel_rate") },
    { label: tt("kpi.order.avg"), value: formatCurrency(avgOrder), note: tt("note.order.avg") }
  ];

  kpiGrid.innerHTML = kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-note">${k.note}</div>
    </div>
  `).join("");
}

// Apply filters
function applyFilters() {
  const search = searchInput.value.toLowerCase().trim();
  const status = statusFilter.value;
  const channel = channelFilter.value;
  const sample = sampleFilter.value;
  const product = productFilter.value.toLowerCase().trim();
  const province = provinceFilter.value;
  const from = dateFrom.value ? new Date(dateFrom.value) : null;
  const to = dateTo.value ? new Date(dateTo.value) : null;

  filteredOrders = allOrders.filter(o => {
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

    if (from || to) {
      if (!(o._date instanceof Date) || Number.isNaN(o._date.getTime())) return false;
      if (from && o._date < from) return false;
      if (to) {
        const inclusiveTo = new Date(to);
        inclusiveTo.setHours(23, 59, 59, 999);
        if (o._date > inclusiveTo) return false;
      }
    }

    return true;
  });

  currentPage = 1;
  renderTable();
  updateFilterMeta();
}

// Sort orders and return sorted array
function getSortedOrders() {
  const sort = sortSelect.value;
  const sorted = [...filteredOrders];

  sorted.sort((a, b) => {
    switch (sort) {
      case "date_desc":
        return (b._date || 0) - (a._date || 0);
      case "date_asc":
        return (a._date || 0) - (b._date || 0);
      case "amount_desc":
        return (parseFloat(b["Order Amount"]) || 0) - (parseFloat(a["Order Amount"]) || 0);
      case "amount_asc":
        return (parseFloat(a["Order Amount"]) || 0) - (parseFloat(b["Order Amount"]) || 0);
      default:
        return 0;
    }
  });

  return sorted;
}

// Render table
function renderTable() {
  const sorted = getSortedOrders();

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const page = sorted.slice(start, end);

  orderTableBody.innerHTML = page.map((o, idx) => `
    <tr data-index="${start + idx}">
      <td class="order-id">${escapeHtml(o["Order ID"] || "")}</td>
      <td>${formatDate(o._date)}</td>
      <td class="product-name">${escapeHtml(o._product)}</td>
      <td class="sku-cell">${escapeHtml(o["Seller SKU"] || "")}</td>
      <td>${escapeHtml(o["Quantity"] || "")}</td>
      <td class="amount-cell">${formatCurrency(parseFloat(o["Order Amount"]) || 0)}</td>
      <td><span class="status-badge status-${escapeHtml((o["Order Status"] || "").toLowerCase().replace(/\s/g, "-"))}">${escapeHtml(o["Order Status"] || "")}</span></td>
      <td>${escapeHtml(o["Purchase Channel"] || "")}</td>
      <td>${escapeHtml(o["Province"] || "")}</td>
      <td>${o._isSample ? '<span class="sample-badge">寄样</span>' : ""}</td>
    </tr>
  `).join("");

  // Add click handlers
  orderTableBody.querySelectorAll("tr").forEach(row => {
    row.addEventListener("click", () => {
      const index = parseInt(row.dataset.index);
      showOrderDetail(sorted[index]);
    });
  });

  renderPagination();
}

// Render pagination
function renderPagination() {
  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  const buttons = [];

  buttons.push(`<button class="page-btn" data-page="1" ${currentPage === 1 ? "disabled" : ""}>&laquo;</button>`);

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      buttons.push(`<button class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`);
    } else if (buttons[buttons.length - 1] !== "...") {
      buttons.push("...");
    }
  }

  buttons.push(`<button class="page-btn" data-page="${totalPages}" ${currentPage === totalPages ? "disabled" : ""}>&raquo;</button>`);

  pagination.innerHTML = buttons.map(b => typeof b === "string" && b !== "..." ? b : (b === "..." ? '<span class="page-ellipsis">...</span>' : b)).join("");

  pagination.querySelectorAll(".page-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.dataset.page);
      if (page === currentPage) return;
      if (btn.textContent === "«") currentPage = 1;
      else if (btn.textContent === "»") currentPage = totalPages;
      else currentPage = page;
      renderTable();
    });
  });
}

// Update filter meta
function updateFilterMeta() {
  filterMeta.textContent = `显示 ${filteredOrders.length} / ${allOrders.length} 订单`;
}

// Show order detail drawer
function showOrderDetail(order) {
  const fields = [
    { key: "Order ID", label: "订单号" },
    { key: "Order Status", label: "订单状态" },
    { key: "Order Substatus", label: "订单子状态" },
    { key: "Seller SKU", label: "SKU编码" },
    { key: "_product", label: "产品名" },
    { key: "Product Name", label: "原始产品名" },
    { key: "Variation", label: "规格" },
    { key: "Quantity", label: "数量" },
    { key: "SKU Unit Original Price", label: "SKU原价", format: formatCurrency },
    { key: "SKU Subtotal After Discount", label: "SKU折后价", format: formatCurrency },
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

  drawerBody.innerHTML = fields.map(f => {
    const value = order[f.key];
    const display = f.format ? f.format(value) : escapeHtml(value || "-");
    return `
      <div class="detail-row">
        <div class="detail-label">${escapeHtml(f.label)}</div>
        <div class="detail-value">${display}</div>
      </div>
    `;
  }).join("");

  orderDrawer.classList.add("open");
}

// Close drawer
orderDrawer.querySelector(".drawer-close").addEventListener("click", () => {
  orderDrawer.classList.remove("open");
});
orderDrawer.querySelector(".drawer-overlay").addEventListener("click", () => {
  orderDrawer.classList.remove("open");
});

// Reset filters
resetFilters.addEventListener("click", () => {
  searchInput.value = "";
  statusFilter.value = "";
  channelFilter.value = "";
  sampleFilter.value = "";
  productFilter.value = "";
  provinceFilter.value = "";
  dateFrom.value = "";
  dateTo.value = "";
  applyFilters();
});

// Export filtered results
exportBtn.addEventListener("click", () => {
  if (!filteredOrders.length) {
    alert("没有可导出的订单");
    return;
  }

  const headers = ["订单号", "下单时间", "产品名", "SKU", "数量", "订单金额", "状态", "渠道", "省份", "寄样"];
  const rows = filteredOrders.map(o => [
    o["Order ID"],
    o["Created Time"],
    o._product,
    o["Seller SKU"],
    o["Quantity"],
    o["Order Amount"],
    o["Order Status"],
    o["Purchase Channel"],
    o["Province"],
    o._isSample ? "是" : "否"
  ]);

  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `订单筛选结果_${formatLocalDateKey(new Date())}.csv`;
  link.click();
});

// Filter listeners
searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);
channelFilter.addEventListener("change", applyFilters);
sampleFilter.addEventListener("change", applyFilters);
productFilter.addEventListener("input", applyFilters);
provinceFilter.addEventListener("change", applyFilters);
dateFrom.addEventListener("change", applyFilters);
dateTo.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", () => {
  currentPage = 1;
  renderTable();
});

// ─────────────────────────────────────────
// V2: 聚合分析
// ─────────────────────────────────────────

const chartInstances = {};

// 取消原因 英文→中文 映射
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

const CANCEL_BY_ZH = {
  "System": "系统",
  "User": "买家",
  "Seller": "卖家",
  "Operator": "运营"
};

function translateCancelReason(en) {
  const trimmed = (en || "").trim();
  if (!trimmed) return "未填写";
  return CANCEL_REASON_ZH[trimmed] || trimmed;
}

function translateCancelBy(en) {
  const trimmed = (en || "").trim();
  if (!trimmed) return "-";
  return CANCEL_BY_ZH[trimmed] || trimmed;
}

// 饼图调色板（10 色循环）
const PIE_PALETTE = [
  "rgba(91, 208, 255, 0.85)",
  "rgba(255, 180, 84, 0.85)",
  "rgba(255, 111, 174, 0.85)",
  "rgba(74, 222, 128, 0.85)",
  "rgba(251, 191, 36, 0.85)",
  "rgba(248, 113, 113, 0.85)",
  "rgba(167, 139, 250, 0.85)",
  "rgba(110, 231, 183, 0.85)",
  "rgba(96, 165, 250, 0.85)",
  "rgba(244, 114, 182, 0.85)"
];

function destroyChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}

function renderAggregates() {
  const aggregateSection = document.getElementById("aggregateSection");
  if (aggregateSection) aggregateSection.style.display = "";

  const paid = allOrders.filter(o => !o._isSample);
  const samples = allOrders.filter(o => o._isSample);

  // 表格类可以立即渲染
  renderProductRanking(paid);

  // 图表等 DOM 布局完成后再建（让容器拿到正确尺寸）
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      renderProvinceChart(paid);
      renderStatusChart(paid);
      renderTrendChart(paid);
      renderCancelTable(paid);   // 现在是饼图
      renderSampleTable(samples); // 现在是饼图
    });
  });
}

// 产品排行榜
function renderProductRanking(paid) {
  const map = {};
  paid.forEach(o => {
    const p = o._product || o["Seller SKU"] || "未知";
    if (!map[p]) map[p] = { orders: 0, gmv: 0, canceled: 0, completed: 0 };
    map[p].orders++;
    map[p].gmv += parseFloat(o["Order Amount"]) || 0;
    if (o["Order Status"] === "Canceled") map[p].canceled++;
    if (o["Order Status"] === "Completed") map[p].completed++;
  });

  const ranked = Object.entries(map)
    .sort((a, b) => b[1].orders - a[1].orders);

  const tbody = document.getElementById("productRankBody");
  if (!tbody) return;

  tbody.innerHTML = ranked.map(([name, d], i) => {
    const cancelRate = d.orders > 0 ? (d.canceled / d.orders * 100).toFixed(1) : "0.0";
    const rateClass = parseFloat(cancelRate) > 50 ? "danger" : parseFloat(cancelRate) > 30 ? "warning" : "ok";
    const rowClass = parseFloat(cancelRate) > 50 ? "row-alert" : "";
    return `
      <tr class="${rowClass}">
        <td class="rank-num">${i + 1}</td>
        <td class="product-name">${escapeHtml(name)}</td>
        <td><strong>${d.orders}</strong></td>
        <td>${formatCurrency(d.gmv)}</td>
        <td><span class="cancel-rate rate-${rateClass}">${cancelRate}%</span></td>
      </tr>`;
  }).join("");

  // 在标题旁加产品数 badge
  const titleEl = document.querySelector('#aggregateSection .agg-card.agg-wide .agg-title');
  if (titleEl && !titleEl.querySelector('.count-badge')) {
    const badge = document.createElement('span');
    badge.className = 'count-badge';
    titleEl.appendChild(badge);
  }
  const badge = titleEl?.querySelector('.count-badge');
  if (badge) badge.textContent = ` · 共 ${ranked.length} 个产品`;
}

// 省份 TOP10 横向柱状图
function renderProvinceChart(paid) {
  const map = {};
  paid.forEach(o => {
    const p = o["Province"] || "未知";
    map[p] = (map[p] || 0) + 1;
  });
  const top10 = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10).reverse(); // reverse 让最多的在顶部

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
        backgroundColor: "rgba(91, 208, 255, 0.7)",
        borderColor: "rgba(91, 208, 255, 1)",
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => `订单数: ${ctx.parsed.x}` } }
      },
      scales: {
        x: { ticks: { color: "#1f2937" }, grid: { color: "rgba(15,23,42,0.12)" } },
        y: { ticks: { color: "#111111", font: { size: 11 } }, grid: { display: false } }
      }
    }
  });
}

// 订单状态分布 环形图
function renderStatusChart(paid) {
  const map = {};
  paid.forEach(o => {
    const s = o["Order Status"] || "Unknown";
    map[s] = (map[s] || 0) + 1;
  });

  const STATUS_COLORS = {
    "Shipped":   "rgba(75, 192, 192, 0.85)",
    "Completed": "rgba(74, 222, 128, 0.85)",
    "Canceled":  "rgba(248, 113, 113, 0.85)",
    "To ship":   "rgba(251, 191, 36, 0.85)",
    "Unpaid":    "rgba(154, 163, 178, 0.85)"
  };

  const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, c]) => s + c, 0);

  destroyChart("statusChart");
  const ctx = document.getElementById("statusChart");
  if (!ctx) return;

  chartInstances["statusChart"] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: entries.map(([s]) => s),
      datasets: [{
        data: entries.map(([, c]) => c),
        backgroundColor: entries.map(([s]) => STATUS_COLORS[s] || "rgba(154,163,178,0.85)"),
        borderWidth: 2,
        borderColor: "#151824"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "60%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#9aa3b2", padding: 10, font: { size: 12 }, boxWidth: 14 }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = ctx.parsed;
              const pct = total ? ((v / total) * 100).toFixed(1) : 0;
              return `${ctx.label}: ${v} (${pct}%)`;
            }
          }
        }
      }
    }
  });
}

// Local-date helper（避开 UTC 时区错位）
function toLocalDateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 每日趋势折线图
function renderTrendChart(paid) {
  const map = {};
  paid.forEach(o => {
    if (!o._date) return;
    const key = toLocalDateKey(o._date);
    if (!map[key]) map[key] = { orders: 0, gmv: 0 };
    map[key].orders++;
    map[key].gmv += parseFloat(o["Order Amount"]) || 0;
  });

  const sorted = Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  const labels = sorted.map(([d]) => d.slice(5)); // MM-DD
  const orderCounts = sorted.map(([, v]) => v.orders);
  // 印尼习惯 juta（百万），1 juta = 1,000,000 IDR
  const gmvValues = sorted.map(([, v]) => +(v.gmv / 1_000_000).toFixed(2));

  destroyChart("trendChart");
  const ctx = document.getElementById("trendChart");
  if (!ctx) return;

  chartInstances["trendChart"] = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "订单数",
          data: orderCounts,
          borderColor: "rgba(91, 208, 255, 1)",
          backgroundColor: "rgba(91, 208, 255, 0.12)",
          fill: true,
          tension: 0.3,
          yAxisID: "yOrders",
          pointRadius: 2,
          pointHoverRadius: 5,
          borderWidth: 2
        },
        {
          label: "GMV (juta IDR)",
          data: gmvValues,
          borderColor: "rgba(255, 180, 84, 1)",
          backgroundColor: "rgba(255, 180, 84, 0.1)",
          fill: true,
          tension: 0.3,
          yAxisID: "yGmv",
          pointRadius: 2,
          pointHoverRadius: 5,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { color: "#9aa3b2", usePointStyle: true } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (ctx.dataset.yAxisID === "yGmv") {
                return `GMV: ${ctx.parsed.y} juta (${(ctx.parsed.y * 1_000_000).toLocaleString("zh-CN")} IDR)`;
              }
              return `订单数: ${ctx.parsed.y}`;
            }
          }
        }
      },
      scales: {
        x: { ticks: { color: "#9aa3b2", maxTicksLimit: 16, font: { size: 11 } }, grid: { color: "rgba(255,255,255,0.05)" } },
        yOrders: {
          type: "linear", position: "left", beginAtZero: true,
          title: { display: true, text: "订单数", color: "rgba(91,208,255,0.9)", font: { size: 11 } },
          ticks: { color: "rgba(91,208,255,0.9)" },
          grid: { color: "rgba(255,255,255,0.05)" }
        },
        yGmv: {
          type: "linear", position: "right", beginAtZero: true,
          title: { display: true, text: "GMV (juta)", color: "rgba(255,180,84,0.9)", font: { size: 11 } },
          ticks: { color: "rgba(255,180,84,0.9)" },
          grid: { display: false }
        }
      }
    }
  });
}

// 通用饼图渲染器
function renderPieChart(canvasId, entries, emptyText) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  if (!entries.length) {
    // 显示空态
    const c = ctx.getContext("2d");
    c.clearRect(0, 0, ctx.width, ctx.height);
    c.fillStyle = "#9aa3b2";
    c.font = "14px system-ui";
    c.textAlign = "center";
    c.fillText(emptyText || "暂无数据", ctx.width / 2, ctx.height / 2);
    return;
  }

  const total = entries.reduce((s, [, c]) => s + c, 0);

  chartInstances[canvasId] = new Chart(ctx, {
    type: "pie",
    data: {
      labels: entries.map(([k]) => k),
      datasets: [{
        data: entries.map(([, v]) => v),
        backgroundColor: entries.map((_, i) => PIE_PALETTE[i % PIE_PALETTE.length]),
        borderWidth: 2,
        borderColor: "#151824"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: "#9aa3b2",
            padding: 8,
            font: { size: 11 },
            boxWidth: 12,
            generateLabels: (chart) => {
              const data = chart.data;
              return data.labels.map((label, i) => {
                const val = data.datasets[0].data[i];
                const pct = total ? ((val / total) * 100).toFixed(1) : 0;
                // 标签太长就截断
                const shortLabel = label.length > 18 ? label.slice(0, 17) + "…" : label;
                return {
                  text: `${shortLabel}  ${pct}%`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].backgroundColor[i],
                  index: i
                };
              });
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = ctx.parsed;
              const pct = total ? ((v / total) * 100).toFixed(1) : 0;
              return `${ctx.label}: ${v} (${pct}%)`;
            }
          }
        }
      }
    }
  });
}

// 取消原因饼图（中文）
function renderCancelTable(paid) {
  const canceled = paid.filter(o => o["Order Status"] === "Canceled");
  const map = {};
  canceled.forEach(o => {
    const reason = translateCancelReason(o["Cancel Reason"]);
    map[reason] = (map[reason] || 0) + 1;
  });

  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
  renderPieChart("cancelChart", sorted, "暂无取消订单");
}

// 寄样产品分布饼图
function renderSampleTable(samples) {
  const map = {};
  samples.forEach(o => {
    const p = o._product || o["Seller SKU"] || "未知";
    map[p] = (map[p] || 0) + 1;
  });

  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
  renderPieChart("sampleChart", sorted, "暂无寄样订单");
}

// Back to top button
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.style.display = window.scrollY > 300 ? "block" : "none";
});
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
