const fileInput = document.getElementById("fileInput");
const fileMeta = document.getElementById("fileMeta");
const kpiGrid = document.getElementById("kpiGrid");
const inFlightGrid = document.getElementById("inFlightGrid");
const dataStatus = document.getElementById("dataStatus");
const recommendationsEl = document.getElementById("recommendations");
const dataTable = document.getElementById("dataTable");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const downloadCsvBtn = document.getElementById("downloadCsv");
const trendGranularity = document.getElementById("trendGranularity");
const accountTable = document.getElementById("accountTable");
const typeTable = document.getElementById("typeTable");
const sourceTable = document.getElementById("sourceTable");
const roiThresholdInput = document.getElementById("roiThreshold");
const ctrThresholdInput = document.getElementById("ctrThreshold");
const cvrThresholdInput = document.getElementById("cvrThreshold");
const applyThresholdBtn = document.getElementById("applyThreshold");
const alertSummary = document.getElementById("alertSummary");
const videoFileInput = document.getElementById("videoFileInput");
const videoFileMeta = document.getElementById("videoFileMeta");
const videoDataStatus = document.getElementById("videoDataStatus");
const videoKpiGrid = document.getElementById("videoKpiGrid");
const videoGrid = document.getElementById("videoGrid");
const videoSearchInput = document.getElementById("videoSearchInput");
const videoSortSelect = document.getElementById("videoSortSelect");
const loadMoreVideosBtn = document.getElementById("loadMoreVideos");

let rows = [];
let filteredRows = [];
let charts = {};
let currentSummary = null;

const numericFields = [
  "成本",
  "SKU 订单数",
  "平均下单成本",
  "总收入",
  "ROI",
  "商品广告曝光数",
  "商品广告点击数",
  "商品广告点击率",
  "广告转化率",
  "广告视频播放达 2 秒播放率",
  "广告视频播放达 6 秒播放率",
  "广告视频播放达 25% 播放率",
  "广告视频播放达 50% 播放率",
  "广告视频播放达 75% 播放率",
  "广告视频完播率"
];

const percentFields = [
  "商品广告点击率",
  "广告转化率",
  "广告视频播放达 2 秒播放率",
  "广告视频播放达 6 秒播放率",
  "广告视频播放达 25% 播放率",
  "广告视频播放达 50% 播放率",
  "广告视频播放达 75% 播放率",
  "广告视频完播率"
];

const tableColumns = [
  "视频 ID",
  "视频标题",
  "TikTok 账号",
  "发布时间",
  "成本",
  "SKU 订单数",
  "总收入",
  "ROI",
  "商品广告点击率",
  "广告转化率",
  "广告视频完播率",
  "状态"
];

const watchFields = [
  "广告视频播放达 2 秒播放率",
  "广告视频播放达 6 秒播放率",
  "广告视频播放达 25% 播放率",
  "广告视频播放达 50% 播放率",
  "广告视频播放达 75% 播放率",
  "广告视频完播率"
];

function toNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/,/g, "").replace(/%/g, "");
  const num = Number(cleaned);
  if (Number.isNaN(num)) return 0;
  if (String(value).includes("%")) return num / 100;
  return num;
}

function parseThreshold(value, isPercent) {
  if (!value) return null;
  const str = String(value).trim();
  if (!str) return null;
  const num = Number(str.replace(/%/g, ""));
  if (Number.isNaN(num)) return null;
  if (isPercent) {
    if (str.includes("%")) return num / 100;
    if (num > 1) return num / 100;
    return num;
  }
  return num;
}

function fmtNumber(value, digits = 0) {
  return value.toLocaleString("zh-CN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function fmtCurrency(value) {
  return value.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function fmtPct(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function parseDate(value) {
  if (!value) return null;
  if (typeof value === "number") {
    const utc = (value - 25569) * 86400 * 1000;
    return new Date(utc);
  }
  const str = String(value).trim();
  if (!str) return null;
  const direct = new Date(str);
  if (!Number.isNaN(direct.getTime())) return direct;
  const fallback = str.replace(/\./g, "-");
  const parsed = new Date(fallback);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  return null;
}

function formatDay(date) {
  return date.toISOString().slice(0, 10);
}

function formatMonth(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatWeek(date) {
  const temp = new Date(date.getTime());
  temp.setHours(0, 0, 0, 0);
  temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
  const week1 = new Date(temp.getFullYear(), 0, 4);
  const weekNo = 1 + Math.round(((temp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${temp.getFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function parseSheet(data) {
  const workbook = XLSX.read(data, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  const header = raw[0];
  const dataRows = raw.slice(1).filter(row => row.some(cell => cell !== ""));
  return dataRows.map(row => {
    const obj = {};
    header.forEach((key, idx) => {
      obj[key] = row[idx] ?? "";
    });
    numericFields.forEach(field => {
      if (field in obj) obj[field] = toNumber(obj[field]);
    });
    obj.__date = parseDate(obj["发布时间"]);
    return obj;
  });
}

function updateKpis(data) {
  const cost = data.reduce((sum, r) => sum + r["成本"], 0);
  const revenue = data.reduce((sum, r) => sum + r["总收入"], 0);
  const orders = data.reduce((sum, r) => sum + r["SKU 订单数"], 0);
  const impressions = data.reduce((sum, r) => sum + r["商品广告曝光数"], 0);
  const clicks = data.reduce((sum, r) => sum + r["商品广告点击数"], 0);
  const roi = cost > 0 ? revenue / cost : 0;
  const cpa = orders > 0 ? cost / orders : 0;
  const ctr = impressions > 0 ? clicks / impressions : 0;
  const cvr = clicks > 0 ? orders / clicks : 0;

  const avgWatch = watchFields.map(field => {
    const weighted = data.reduce((sum, r) => sum + r[field] * (r["商品广告曝光数"] || 1), 0);
    const base = data.reduce((sum, r) => sum + (r["商品广告曝光数"] || 1), 0);
    return base > 0 ? weighted / base : 0;
  });

  const kpis = [
    { title: "总成本", value: fmtCurrency(cost), note: "GMV MAX 投放成本总和" },
    { title: "总收入", value: fmtCurrency(revenue), note: "GMV MAX 归因收入" },
    { title: "整体 ROI", value: roi.toFixed(2), note: "总收入 ÷ 总成本" },
    { title: "总订单数", value: fmtNumber(orders), note: "SKU 订单汇总" },
    { title: "平均下单成本", value: fmtCurrency(cpa), note: "成本 ÷ 订单" },
    { title: "整体点击率", value: fmtPct(ctr), note: "点击 ÷ 曝光" },
    { title: "整体转化率", value: fmtPct(cvr), note: "订单 ÷ 点击" },
    { title: "平均完播率", value: fmtPct(avgWatch[5]), note: "平均观看深度" }
  ];

  kpiGrid.innerHTML = kpis.map(kpi => `
    <div class="kpi-card">
      <div class="kpi-title">${kpi.title}</div>
      <div class="kpi-value">${kpi.value}</div>
      <div class="kpi-note">${kpi.note}</div>
    </div>
  `).join("");

  dataStatus.textContent = `已导入 ${data.length} 条视频数据`;
  dataStatus.style.color = "#5bd0ff";

  return { cost, revenue, roi, ctr, cvr, watch: avgWatch, orders, impressions, clicks };
}

function updateInFlight(data) {
  const inFlight = data.filter(r => r["状态"] === "投放中");
  if (!inFlight.length) {
    inFlightGrid.innerHTML = "<div class=\"kpi-card\"><div class=\"kpi-title\">暂无投放中素材</div><div class=\"kpi-value\">0</div></div>";
    return null;
  }
  const impressions = inFlight.reduce((sum, r) => sum + r["商品广告曝光数"], 0);
  const cost = inFlight.reduce((sum, r) => sum + r["成本"], 0);
  const revenue = inFlight.reduce((sum, r) => sum + r["总收入"], 0);
  const orders = inFlight.reduce((sum, r) => sum + r["SKU 订单数"], 0);
  const clicks = inFlight.reduce((sum, r) => sum + r["商品广告点击数"], 0);
  const roi = cost > 0 ? revenue / cost : 0;
  const ctr = impressions > 0 ? clicks / impressions : 0;
  const cvr = clicks > 0 ? orders / clicks : 0;

  const watchAvg = watchFields.map(field => {
    const weighted = inFlight.reduce((sum, r) => sum + r[field] * (r["商品广告曝光数"] || 1), 0);
    const base = inFlight.reduce((sum, r) => sum + (r["商品广告曝光数"] || 1), 0);
    return base > 0 ? weighted / base : 0;
  });

  const cards = [
    { title: "投放中曝光", value: fmtNumber(impressions), note: "在投素材曝光量" },
    { title: "投放中成本", value: fmtCurrency(cost), note: "在投素材成本" },
    { title: "投放中收入", value: fmtCurrency(revenue), note: "在投素材收入" },
    { title: "投放中 ROI", value: roi.toFixed(2), note: "投放中 ROI" },
    { title: "投放中 CTR", value: fmtPct(ctr), note: "投放中点击率" },
    { title: "投放中 CVR", value: fmtPct(cvr), note: "投放中转化率" },
    { title: "2 秒播放率", value: fmtPct(watchAvg[0]), note: "投放中素材" },
    { title: "6 秒播放率", value: fmtPct(watchAvg[1]), note: "投放中素材" },
    { title: "25% 播放率", value: fmtPct(watchAvg[2]), note: "投放中素材" },
    { title: "50% 播放率", value: fmtPct(watchAvg[3]), note: "投放中素材" },
    { title: "75% 播放率", value: fmtPct(watchAvg[4]), note: "投放中素材" },
    { title: "完播率", value: fmtPct(watchAvg[5]), note: "投放中素材" }
  ];

  inFlightGrid.innerHTML = cards.map(card => `
    <div class="kpi-card">
      <div class="kpi-title">${card.title}</div>
      <div class="kpi-value">${card.value}</div>
      <div class="kpi-note">${card.note}</div>
    </div>
  `).join("");

  return { impressions, cost, revenue, roi, ctr, cvr, watchAvg };
}

function buildTrend(data, granularity) {
  const buckets = new Map();
  data.forEach(row => {
    if (!row.__date) return;
    let key = "";
    if (granularity === "month") key = formatMonth(row.__date);
    else if (granularity === "week") key = formatWeek(row.__date);
    else key = formatDay(row.__date);
    if (!buckets.has(key)) {
      buckets.set(key, { cost: 0, revenue: 0, orders: 0, impressions: 0, clicks: 0 });
    }
    const bucket = buckets.get(key);
    bucket.cost += row["成本"];
    bucket.revenue += row["总收入"];
    bucket.orders += row["SKU 订单数"];
    bucket.impressions += row["商品广告曝光数"];
    bucket.clicks += row["商品广告点击数"];
  });

  const labels = Array.from(buckets.keys()).sort();
  const cost = labels.map(key => buckets.get(key).cost);
  const revenue = labels.map(key => buckets.get(key).revenue);
  const roi = labels.map(key => {
    const bucket = buckets.get(key);
    return bucket.cost > 0 ? bucket.revenue / bucket.cost : 0;
  });

  return { labels, cost, revenue, roi };
}

function renderTrendChart(trend) {
  if (charts.trend) charts.trend.destroy();
  charts.trend = new Chart(document.getElementById("trendChart"), {
    type: "line",
    data: {
      labels: trend.labels,
      datasets: [
        {
          label: "成本",
          data: trend.cost,
          borderColor: "#ffb454",
          backgroundColor: "rgba(255,180,84,0.2)",
          tension: 0.35,
          yAxisID: "y"
        },
        {
          label: "收入",
          data: trend.revenue,
          borderColor: "#5bd0ff",
          backgroundColor: "rgba(91,208,255,0.2)",
          tension: 0.35,
          yAxisID: "y"
        },
        {
          label: "ROI",
          data: trend.roi,
          borderColor: "#4ade80",
          backgroundColor: "rgba(74,222,128,0.2)",
          tension: 0.35,
          yAxisID: "y1"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#9aa3b2" } } },
      scales: {
        y: {
          position: "left",
          ticks: { color: "#9aa3b2" },
          grid: { color: "rgba(255,255,255,0.06)" }
        },
        y1: {
          position: "right",
          ticks: { color: "#9aa3b2" },
          grid: { drawOnChartArea: false }
        },
        x: { ticks: { color: "#9aa3b2" }, grid: { display: false } }
      }
    }
  });
}

function renderCharts(summary) {
  const ctrLabels = ["点击率", "转化率"];
  const ctrData = [summary.ctr * 100, summary.cvr * 100];

  const watchLabels = ["2 秒", "6 秒", "25%", "50%", "75%", "完播"];
  const watchData = summary.watch.map(v => v * 100);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { ticks: { color: "#9aa3b2" }, grid: { color: "rgba(255,255,255,0.06)" } },
      x: { ticks: { color: "#9aa3b2" }, grid: { display: false } }
    }
  };

  if (charts.ctr) charts.ctr.destroy();
  if (charts.watch) charts.watch.destroy();

  charts.ctr = new Chart(document.getElementById("ctrChart"), {
    type: "bar",
    data: {
      labels: ctrLabels,
      datasets: [{
        data: ctrData,
        backgroundColor: ["#ff6fae", "#4ade80"],
        borderRadius: 10
      }]
    },
    options: {
      ...chartOptions,
      scales: {
        y: { ticks: { color: "#9aa3b2", callback: value => `${value}%` }, grid: { color: "rgba(255,255,255,0.06)" } },
        x: { ticks: { color: "#9aa3b2" }, grid: { display: false } }
      }
    }
  });

  charts.watch = new Chart(document.getElementById("watchChart"), {
    type: "line",
    data: {
      labels: watchLabels,
      datasets: [{
        data: watchData,
        borderColor: "#ffb454",
        backgroundColor: "rgba(255, 180, 84, 0.25)",
        tension: 0.35,
        fill: true
      }]
    },
    options: {
      ...chartOptions,
      scales: {
        y: { ticks: { color: "#9aa3b2", callback: value => `${value}%` }, grid: { color: "rgba(255,255,255,0.06)" } },
        x: { ticks: { color: "#9aa3b2" }, grid: { display: false } }
      }
    }
  });
}

function buildAggregate(data, key) {
  const map = new Map();
  data.forEach(row => {
    const group = row[key] || "未分类";
    if (!map.has(group)) {
      map.set(group, { count: 0, cost: 0, revenue: 0, orders: 0, impressions: 0, clicks: 0 });
    }
    const bucket = map.get(group);
    bucket.count += 1;
    bucket.cost += row["成本"];
    bucket.revenue += row["总收入"];
    bucket.orders += row["SKU 订单数"];
    bucket.impressions += row["商品广告曝光数"];
    bucket.clicks += row["商品广告点击数"];
  });

  return Array.from(map.entries()).map(([name, bucket]) => ({
    name,
    count: bucket.count,
    cost: bucket.cost,
    revenue: bucket.revenue,
    roi: bucket.cost > 0 ? bucket.revenue / bucket.cost : 0,
    ctr: bucket.impressions > 0 ? bucket.clicks / bucket.impressions : 0,
    cvr: bucket.clicks > 0 ? bucket.orders / bucket.clicks : 0
  })).sort((a, b) => b.roi - a.roi);
}

function renderAggregateTable(tableEl, data) {
  const thead = tableEl.querySelector("thead");
  const tbody = tableEl.querySelector("tbody");
  thead.innerHTML = `
    <tr>
      <th>维度</th>
      <th>视频数</th>
      <th>成本</th>
      <th>收入</th>
      <th>ROI</th>
      <th>CTR</th>
      <th>CVR</th>
    </tr>
  `;

  tbody.innerHTML = data.slice(0, 10).map(row => `
    <tr>
      <td>${row.name}</td>
      <td>${fmtNumber(row.count)}</td>
      <td>${fmtCurrency(row.cost)}</td>
      <td>${fmtCurrency(row.revenue)}</td>
      <td>${row.roi.toFixed(2)}</td>
      <td>${fmtPct(row.ctr)}</td>
      <td>${fmtPct(row.cvr)}</td>
    </tr>
  `).join("");
}

function renderRecommendations(data) {
  if (!data.length) {
    recommendationsEl.innerHTML = "<div class=\"rec-card\"><h3>等待数据</h3><p>请先导入 GMV MAX 报表。</p></div>";
    return;
  }

  const roiValues = data.map(r => r["ROI"]);
  const ctrValues = data.map(r => r["商品广告点击率"]);
  const cvrValues = data.map(r => r["广告转化率"]);
  const watchValues = data.map(r => r["广告视频完播率"]);
  const costValues = data.map(r => r["成本"]);
  const impressionValues = data.map(r => r["商品广告曝光数"]);

  const roiP75 = percentile(roiValues, 75);
  const ctrP75 = percentile(ctrValues, 75);
  const cvrMedian = median(cvrValues);
  const watchP25 = percentile(watchValues, 25);
  const costP75 = percentile(costValues, 75);
  const impressionP75 = percentile(impressionValues, 75);

  const topRoi = data
    .filter(r => r["ROI"] >= roiP75)
    .sort((a, b) => b["ROI"] - a["ROI"])
    .slice(0, 5);

  const highCostNoOrder = data
    .filter(r => r["成本"] >= costP75 && r["SKU 订单数"] === 0)
    .slice(0, 5);

  const highImpressionLowCtr = data
    .filter(r => r["商品广告曝光数"] >= impressionP75 && r["商品广告点击率"] < ctrP75)
    .slice(0, 5);

  const highCtrLowCvr = data
    .filter(r => r["商品广告点击率"] >= ctrP75 && r["广告转化率"] < cvrMedian)
    .slice(0, 5);

  const lowWatch = data
    .filter(r => r["广告视频完播率"] <= watchP25)
    .slice(0, 5);

  const recs = [
    {
      title: `高 ROI 素材（前 25%）建议加预算`,
      list: topRoi.map(r => `${r["视频 ID"]} | ROI ${r["ROI"].toFixed(2)}`),
      fallback: "暂无明显高 ROI 素材"
    },
    {
      title: `高成本无订单素材建议暂停`,
      list: highCostNoOrder.map(r => `${r["视频 ID"]} | 成本 ${fmtCurrency(r["成本"])}`),
      fallback: "未发现高成本无订单素材"
    },
    {
      title: `高曝光低点击需优化封面/开头`,
      list: highImpressionLowCtr.map(r => `${r["视频 ID"]} | CTR ${fmtPct(r["商品广告点击率"])}`),
      fallback: "未发现高曝光低点击素材"
    },
    {
      title: `高点击低转化需优化价格或落地页`,
      list: highCtrLowCvr.map(r => `${r["视频 ID"]} | CVR ${fmtPct(r["广告转化率"])}`),
      fallback: "未发现高点击低转化素材"
    },
    {
      title: `低完播率脚本需强化节奏`,
      list: lowWatch.map(r => `${r["视频 ID"]} | 完播 ${fmtPct(r["广告视频完播率"])}`),
      fallback: "完播率整体较好"
    }
  ];

  recommendationsEl.innerHTML = recs.map(rec => `
    <div class="rec-card">
      <h3>${rec.title}</h3>
      ${rec.list.length ? `<ul>${rec.list.map(item => `<li>${item}</li>`).join("")}</ul>` : `<p>${rec.fallback}</p>`}
    </div>
  `).join("");
}

function renderTable(data) {
  const thead = dataTable.querySelector("thead");
  const tbody = dataTable.querySelector("tbody");

  thead.innerHTML = `<tr>${tableColumns.map(col => `<th>${col}</th>`).join("")}</tr>`;

  tbody.innerHTML = data.map(row => {
    const cells = tableColumns.map(col => {
      let value = row[col] ?? "";
      if (percentFields.includes(col)) value = fmtPct(value || 0);
      else if (["成本", "总收入", "平均下单成本"].includes(col)) value = fmtCurrency(value || 0);
      else if (col === "ROI") value = (value || 0).toFixed(2);
      else if (typeof value === "number") value = fmtNumber(value);
      return `<td>${value}</td>`;
    }).join("");
    return `<tr>${cells}</tr>`;
  }).join("");
}

function applyFilterAndSort() {
  const keyword = searchInput.value.trim();
  filteredRows = rows.filter(r => {
    if (!keyword) return true;
    return (
      String(r["视频 ID"] || "").includes(keyword) ||
      String(r["视频标题"] || "").includes(keyword) ||
      String(r["TikTok 账号"] || "").includes(keyword)
    );
  });

  const sortValue = sortSelect.value;
  const sortMap = {
    roi_desc: (a, b) => b["ROI"] - a["ROI"],
    cost_desc: (a, b) => b["成本"] - a["成本"],
    revenue_desc: (a, b) => b["总收入"] - a["总收入"],
    orders_desc: (a, b) => b["SKU 订单数"] - a["SKU 订单数"],
    ctr_desc: (a, b) => b["商品广告点击率"] - a["商品广告点击率"]
  };
  filteredRows.sort(sortMap[sortValue]);

  renderTable(filteredRows.slice(0, 200));
}

function setupDownload() {
  downloadCsvBtn.addEventListener("click", () => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]).filter(key => !key.startsWith("__"));
    const csv = [headers.join(",")]
      .concat(rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "gmv-max-analysis.csv";
    link.click();
  });
}

function renderAlerts(data) {
  const roiThreshold = parseThreshold(roiThresholdInput.value, false);
  const ctrThreshold = parseThreshold(ctrThresholdInput.value, true);
  const cvrThreshold = parseThreshold(cvrThresholdInput.value, true);

  if (roiThreshold === null && ctrThreshold === null && cvrThreshold === null) {
    alertSummary.textContent = "请输入至少一个阈值并点击“应用阈值”";
    return;
  }

  const belowRoi = roiThreshold === null ? [] : data.filter(r => r["ROI"] < roiThreshold);
  const belowCtr = ctrThreshold === null ? [] : data.filter(r => r["商品广告点击率"] < ctrThreshold);
  const belowCvr = cvrThreshold === null ? [] : data.filter(r => r["广告转化率"] < cvrThreshold);

  alertSummary.textContent = `ROI 低于阈值 ${belowRoi.length} 条 | CTR 低于阈值 ${belowCtr.length} 条 | CVR 低于阈值 ${belowCvr.length} 条`;

  const alertCards = [
    {
      title: "ROI 预警",
      list: belowRoi.slice(0, 5).map(r => `${r["视频 ID"]} | ROI ${r["ROI"].toFixed(2)}`),
      fallback: "暂无 ROI 预警"
    },
    {
      title: "CTR 预警",
      list: belowCtr.slice(0, 5).map(r => `${r["视频 ID"]} | CTR ${fmtPct(r["商品广告点击率"])}`),
      fallback: "暂无 CTR 预警"
    },
    {
      title: "CVR 预警",
      list: belowCvr.slice(0, 5).map(r => `${r["视频 ID"]} | CVR ${fmtPct(r["广告转化率"])}`),
      fallback: "暂无 CVR 预警"
    }
  ];

  const alertHtml = alertCards.map(card => `
    <div class="rec-card">
      <h3>${card.title}</h3>
      ${card.list.length ? `<ul>${card.list.map(item => `<li>${item}</li>`).join("")}</ul>` : `<p>${card.fallback}</p>`}
    </div>
  `).join("");

  recommendationsEl.insertAdjacentHTML("afterbegin", alertHtml);
}

if (fileInput) {
  fileInput.addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;
    fileMeta.textContent = `已选择：${file.name}`;

    const reader = new FileReader();
    reader.onload = e => {
      rows = parseSheet(e.target.result);
      currentSummary = updateKpis(rows);
      updateInFlight(rows);
      renderCharts(currentSummary);

      const trend = buildTrend(rows, trendGranularity.value);
      renderTrendChart(trend);

      renderRecommendations(rows);
      renderAggregateTable(accountTable, buildAggregate(rows, "TikTok 账号"));
      renderAggregateTable(typeTable, buildAggregate(rows, "创意作品类型"));
      renderAggregateTable(sourceTable, buildAggregate(rows, "视频来源"));

      applyFilterAndSort();
    };
    reader.readAsArrayBuffer(file);
  });
}

if (trendGranularity) {
  trendGranularity.addEventListener("change", () => {
    if (!rows.length) return;
    const trend = buildTrend(rows, trendGranularity.value);
    renderTrendChart(trend);
  });
}

if (applyThresholdBtn) {
  applyThresholdBtn.addEventListener("click", () => {
    if (!rows.length) return;
    renderRecommendations(rows);
    renderAlerts(rows);
  });
}

if (searchInput) searchInput.addEventListener("input", applyFilterAndSort);
if (sortSelect) sortSelect.addEventListener("change", applyFilterAndSort);
if (downloadCsvBtn) setupDownload();

if (recommendationsEl) renderRecommendations([]);


// CUSCUS视频看板
const videoFields = {
  name: "Video name",
  link: "Video link",
  date: "Video post date",
  creator: "Creator username",
  gmv: "GMV",
  impressions: "Shoppable video impressions",
  likes: "Shoppable video likes",
  comments: "Shoppable video comments"
};

let videoRows = [];
let videoFiltered = [];
let videoPage = 1;
const videoPageSize = 20;

function parseVideoSheet(data) {
  const workbook = XLSX.read(data, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  const header = raw[0];
  const dataRows = raw.slice(1).filter(row => row.some(cell => cell !== ""));

  return dataRows.map(row => {
    const obj = {};
    header.forEach((key, idx) => {
      obj[key] = row[idx] ?? "";
    });
    obj.__name = obj[videoFields.name] || "";
    obj.__link = obj[videoFields.link] || "";
    obj.__date = parseDate(obj[videoFields.date]);
    obj.__creator = obj[videoFields.creator] || "";
    obj.__gmv = toNumber(obj[videoFields.gmv]);
    obj.__impressions = toNumber(obj[videoFields.impressions]);
    obj.__likes = toNumber(obj[videoFields.likes]);
    obj.__comments = toNumber(obj[videoFields.comments]);
    return obj;
  });
}

function updateVideoKpis(data) {
  const totalGmv = data.reduce((sum, r) => sum + r.__gmv, 0);
  const totalImpressions = data.reduce((sum, r) => sum + r.__impressions, 0);
  const totalLikes = data.reduce((sum, r) => sum + r.__likes, 0);
  const totalComments = data.reduce((sum, r) => sum + r.__comments, 0);

  const kpis = [
    { title: "视频数量", value: fmtNumber(data.length), note: "导入的有效视频数" },
    { title: "总 GMV", value: fmtCurrency(totalGmv), note: "视频列表 GMV 汇总" },
    { title: "总曝光", value: fmtNumber(totalImpressions), note: "Shoppable impressions" },
    { title: "总点赞", value: fmtNumber(totalLikes), note: "Shoppable likes" },
    { title: "总评论", value: fmtNumber(totalComments), note: "Shoppable comments" }
  ];

  videoKpiGrid.innerHTML = kpis.map(kpi => `
    <div class="kpi-card">
      <div class="kpi-title">${kpi.title}</div>
      <div class="kpi-value">${kpi.value}</div>
      <div class="kpi-note">${kpi.note}</div>
    </div>
  `).join("");

  videoDataStatus.textContent = `已导入 ${data.length} 条视频`;
  videoDataStatus.style.color = "#5bd0ff";
}

async function fetchVideoThumbnail(url) {
  if (!url) return null;
  try {
    const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.thumbnail_url || null;
  } catch (err) {
    return null;
  }
}

function renderVideoCards(data) {
  const visible = data.slice(0, videoPage * videoPageSize);
  videoGrid.innerHTML = visible.map((row, idx) => `
    <article class="video-card" data-index="${idx}">
      <div class="thumb" data-url="${row.__link}">
        <span>预览加载中</span>
      </div>
      <div class="video-body">
        <div class="video-title">${row.__name || "未命名视频"}</div>
        <div class="video-meta">@${row.__creator || "-"} • ${row.__date ? row.__date.toISOString().slice(0, 10) : "-"}</div>
        <div class="stat-row">
          <div class="stat"><span>GMV</span><strong>${fmtCurrency(row.__gmv)}</strong></div>
          <div class="stat"><span>曝光</span><strong>${fmtNumber(row.__impressions)}</strong></div>
          <div class="stat"><span>点赞</span><strong>${fmtNumber(row.__likes)}</strong></div>
          <div class="stat"><span>评论</span><strong>${fmtNumber(row.__comments)}</strong></div>
        </div>
        <div class="video-actions">
          <a href="${row.__link}" target="_blank" rel="noopener">打开视频</a>
          <button class="copy-btn" data-link="${row.__link}">复制链接</button>
        </div>
      </div>
    </article>
  `).join("");

  setupVideoThumbObserver();

  if (visible.length >= data.length) {
    loadMoreVideosBtn.style.display = "none";
  } else {
    loadMoreVideosBtn.style.display = "inline-flex";
  }
}

function setupVideoThumbObserver() {
  const thumbs = document.querySelectorAll("#videoGrid .thumb");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(async entry => {
      if (!entry.isIntersecting) return;
      const container = entry.target;
      observer.unobserve(container);
      const url = container.getAttribute("data-url");
      const thumb = await fetchVideoThumbnail(url);
      if (!thumb) {
        container.innerHTML = "<span>暂无缩略图</span>";
        return;
      }
      container.innerHTML = `<img src="${thumb}" alt="视频缩略图" />`;
    });
  }, { rootMargin: "200px" });

  thumbs.forEach(thumb => observer.observe(thumb));
}

function applyVideoFilterAndSort(resetPage = true) {
  const keyword = videoSearchInput.value.trim();
  videoFiltered = videoRows.filter(r => {
    if (!keyword) return true;
    return (
      String(r.__name || "").includes(keyword) ||
      String(r.__creator || "").includes(keyword)
    );
  });

  const sortValue = videoSortSelect.value;
  const sortMap = {
    date_desc: (a, b) => (b.__date?.getTime() || 0) - (a.__date?.getTime() || 0),
    gmv_desc: (a, b) => b.__gmv - a.__gmv,
    likes_desc: (a, b) => b.__likes - a.__likes,
    comments_desc: (a, b) => b.__comments - a.__comments
  };
  videoFiltered.sort(sortMap[sortValue]);

  if (resetPage) videoPage = 1;
  renderVideoCards(videoFiltered);
}

if (videoFileInput) {
  videoFileInput.addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;
    videoFileMeta.textContent = `已选择：${file.name}`;

    const reader = new FileReader();
    reader.onload = e => {
      videoRows = parseVideoSheet(e.target.result);
      updateVideoKpis(videoRows);
      applyVideoFilterAndSort(true);
    };
    reader.readAsArrayBuffer(file);
  });
}

if (videoSearchInput) {
  videoSearchInput.addEventListener("input", () => applyVideoFilterAndSort(true));
}

if (videoSortSelect) {
  videoSortSelect.addEventListener("change", () => applyVideoFilterAndSort(true));
}

if (loadMoreVideosBtn) {
  loadMoreVideosBtn.addEventListener("click", () => {
    if (!videoFiltered.length) return;
    videoPage += 1;
    renderVideoCards(videoFiltered);
  });
}

if (videoGrid) {
  videoGrid.addEventListener("click", async event => {
    const btn = event.target.closest(".copy-btn");
    if (!btn) return;
    const link = btn.getAttribute("data-link");
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      btn.textContent = "已复制";
      setTimeout(() => {
        btn.textContent = "复制链接";
      }, 1200);
    } catch (err) {
      btn.textContent = "复制失败";
      setTimeout(() => {
        btn.textContent = "复制链接";
      }, 1200);
    }
  });
}


const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
  const toggleBackToTop = () => {
    if (window.scrollY > 300) backToTopBtn.classList.add("show");
    else backToTopBtn.classList.remove("show");
  };
  window.addEventListener("scroll", toggleBackToTop);
  toggleBackToTop();
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
