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

// Check dependencies
if (typeof XLSX === "undefined") {
  const banner = document.createElement("div");
  banner.className = "lib-warning";
  banner.textContent = "XLSX library not loaded. Please check your network connection.";
  document.body.prepend(banner);
  console.error("XLSX library not loaded!");
} else {
  console.log("XLSX library loaded:", XLSX.version);
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

  console.log("File selected:", file.name, file.type, file.size);

  try {
    const text = await file.text();
    console.log("File text length:", text.length, "First 200 chars:", text.substring(0, 200));

    const workbook = XLSX.read(text, { type: "string", raw: true });
    console.log("Workbook sheets:", workbook.SheetNames);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });

    console.log("Parsed rows:", rows.length);

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

    console.log("Enriched orders sample:", allOrders[0]);

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

    if (from && o._date && o._date < from) return false;
    if (to && o._date && o._date > to) return false;

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
      <td class="order-id">${o["Order ID"] || ""}</td>
      <td>${formatDate(o._date)}</td>
      <td class="product-name">${o._product}</td>
      <td class="sku-cell">${o["Seller SKU"] || ""}</td>
      <td>${o["Quantity"] || ""}</td>
      <td class="amount-cell">${formatCurrency(parseFloat(o["Order Amount"]) || 0)}</td>
      <td><span class="status-badge status-${(o["Order Status"] || "").toLowerCase().replace(/\s/g, "-")}">${o["Order Status"] || ""}</span></td>
      <td>${o["Purchase Channel"] || ""}</td>
      <td>${o["Province"] || ""}</td>
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
    const display = f.format ? f.format(value) : (value || "-");
    return `
      <div class="detail-row">
        <div class="detail-label">${f.label}</div>
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
  link.download = `订单筛选结果_${new Date().toISOString().slice(0, 10)}.csv`;
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

  renderProductRanking(paid);
  renderProvinceChart(paid);
  renderStatusChart(paid);
  renderTrendChart(paid);
  renderCancelTable(paid);
  renderSampleTable(samples);
}

// 产品排行榜
function renderProductRanking(paid) {
  const map = {};
  paid.forEach(o => {
    const p = o._product || o["Seller SKU"] || "未知";
    if (!map[p]) map[p] = { orders: 0, gmv: 0, canceled: 0 };
    map[p].orders++;
    map[p].gmv += parseFloat(o["Order Amount"]) || 0;
    if (o["Order Status"] === "Canceled") map[p].canceled++;
  });

  const ranked = Object.entries(map)
    .sort((a, b) => b[1].orders - a[1].orders);

  const tbody = document.getElementById("productRankBody");
  if (!tbody) return;

  tbody.innerHTML = ranked.map(([name, d], i) => {
    const cancelRate = d.orders > 0 ? (d.canceled / d.orders * 100).toFixed(1) : "0.0";
    const rateClass = parseFloat(cancelRate) > 50 ? "danger" : parseFloat(cancelRate) > 30 ? "warning" : "ok";
    return `
      <tr>
        <td class="rank-num">${i + 1}</td>
        <td class="product-name">${name}</td>
        <td><strong>${d.orders}</strong></td>
        <td>${formatCurrency(d.gmv)}</td>
        <td><span class="cancel-rate rate-${rateClass}">${cancelRate}%</span></td>
      </tr>`;
  }).join("");
}

// 省份 TOP10 横向柱状图
function renderProvinceChart(paid) {
  const map = {};
  paid.forEach(o => {
    const p = o["Province"] || "未知";
    map[p] = (map[p] || 0) + 1;
  });
  const top10 = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10);

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
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#9aa3b2" }, grid: { color: "rgba(255,255,255,0.06)" } },
        y: { ticks: { color: "#f4f6fb" }, grid: { display: false } }
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
    "Shipped":   "rgba(75, 192, 192, 0.8)",
    "Completed": "rgba(74, 222, 128, 0.8)",
    "Canceled":  "rgba(248, 113, 113, 0.8)",
    "To ship":   "rgba(251, 191, 36, 0.8)",
    "Unpaid":    "rgba(154, 163, 178, 0.8)"
  };

  const entries = Object.entries(map);
  destroyChart("statusChart");
  const ctx = document.getElementById("statusChart");
  if (!ctx) return;

  chartInstances["statusChart"] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: entries.map(([s]) => s),
      datasets: [{
        data: entries.map(([, c]) => c),
        backgroundColor: entries.map(([s]) => STATUS_COLORS[s] || "rgba(154,163,178,0.8)"),
        borderWidth: 2,
        borderColor: "#151824"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#9aa3b2", padding: 12, font: { size: 12 } }
        }
      }
    }
  });
}

// 每日趋势折线图
function renderTrendChart(paid) {
  const map = {};
  paid.forEach(o => {
    if (!o._date) return;
    const key = o._date.toISOString().slice(0, 10);
    if (!map[key]) map[key] = { orders: 0, gmv: 0 };
    map[key].orders++;
    map[key].gmv += parseFloat(o["Order Amount"]) || 0;
  });

  const sorted = Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  const labels = sorted.map(([d]) => d);
  const orderCounts = sorted.map(([, v]) => v.orders);
  const gmvValues = sorted.map(([, v]) => Math.round(v.gmv / 1000)); // in K IDR

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
          backgroundColor: "rgba(91, 208, 255, 0.1)",
          fill: true,
          tension: 0.3,
          yAxisID: "yOrders",
          pointRadius: 3
        },
        {
          label: "GMV (千IDR)",
          data: gmvValues,
          borderColor: "rgba(255, 180, 84, 1)",
          backgroundColor: "rgba(255, 180, 84, 0.08)",
          fill: true,
          tension: 0.3,
          yAxisID: "yGmv",
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { color: "#9aa3b2" } }
      },
      scales: {
        x: { ticks: { color: "#9aa3b2", maxTicksLimit: 20 }, grid: { color: "rgba(255,255,255,0.05)" } },
        yOrders: {
          type: "linear", position: "left",
          ticks: { color: "rgba(91,208,255,0.9)" },
          grid: { color: "rgba(255,255,255,0.05)" }
        },
        yGmv: {
          type: "linear", position: "right",
          ticks: { color: "rgba(255,180,84,0.9)" },
          grid: { display: false }
        }
      }
    }
  });
}

// 取消原因表
function renderCancelTable(paid) {
  const canceled = paid.filter(o => o["Order Status"] === "Canceled");
  const map = {};
  canceled.forEach(o => {
    const reason = (o["Cancel Reason"] || "").trim() || "未填写";
    const by = (o["Cancel By"] || "").trim() || "-";
    const key = `${reason}||${by}`;
    map[key] = (map[key] || 0) + 1;
  });

  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
  const tbody = document.getElementById("cancelBody");
  if (!tbody) return;

  if (!sorted.length) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--muted)">暂无取消订单</td></tr>';
    return;
  }

  tbody.innerHTML = sorted.map(([key, cnt]) => {
    const [reason, by] = key.split("||");
    return `<tr>
      <td>${reason}</td>
      <td><strong>${cnt}</strong></td>
      <td>${by}</td>
    </tr>`;
  }).join("");
}

// 寄样产品分布表
function renderSampleTable(samples) {
  const map = {};
  samples.forEach(o => {
    const p = o._product || o["Seller SKU"] || "未知";
    map[p] = (map[p] || 0) + 1;
  });

  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
  const tbody = document.getElementById("sampleBody");
  if (!tbody) return;

  if (!sorted.length) {
    tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;color:var(--muted)">暂无寄样订单</td></tr>';
    return;
  }

  tbody.innerHTML = sorted.map(([name, cnt]) => `
    <tr>
      <td class="product-name">${name}</td>
      <td><strong>${cnt}</strong></td>
    </tr>`).join("");
}

// Back to top button
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.style.display = window.scrollY > 300 ? "block" : "none";
});
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
