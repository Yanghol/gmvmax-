/* ════════════════════════════════════════════════════════════
 * CusCus 产品成本计算器
 * 价格库内置数据，无需导入文件
 * ════════════════════════════════════════════════════════════ */

// ─── 内置价格库数据 ──────────────────────────────────────────
const PRICING_DATA = [
  { "产品销售方案": "洁面慕斯", "赠品": "贴纸+铅笔", "旧SKU编码": "5263*1+0020*1+0037*1", "新改产品SKU编码": "8995107505263", "是否当前主推": "0", "划线价（不低于）": 96000, "日常价（不低于）": 86400, "小促价（不低于）": 76800, "大促价（不低于）": "", "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "润肤乳", "赠品": "贴纸+铅笔", "旧SKU编码": "5270*1+0020*1+0037*1", "新改产品SKU编码": "8995107505270", "是否当前主推": "0", "划线价（不低于）": 95200, "日常价（不低于）": 85680, "小促价（不低于）": 76160, "大促价（不低于）": "", "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "冰沙霜", "赠品": "贴纸+铅笔", "旧SKU编码": "5256*1+0020*1+0037*1", "新改产品SKU编码": "8995107505256", "是否当前主推": "0", "划线价（不低于）": 102560, "日常价（不低于）": 92304, "小促价（不低于）": 82048, "大促价（不低于）": "", "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "冰沙霜小样", "赠品": "/", "旧SKU编码": "", "新改产品SKU编码": "8995107505294", "是否当前主推": "", "划线价（不低于）": 55040, "日常价（不低于）": 38528, "小促价（不低于）": "", "大促价（不低于）": "", "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "润肤乳小样", "赠品": "/", "旧SKU编码": "", "新改产品SKU编码": "8995107505287", "是否当前主推": "", "划线价（不低于）": 52880, "日常价（不低于）": 37016, "小促价（不低于）": "", "大促价（不低于）": "", "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "洁面慕斯*2+冰沙霜小样", "赠品": "贴纸", "旧SKU编码": "5263*2+5294*1+0020*1", "新改产品SKU编码": "5263*2+5294*1", "是否当前主推": "0", "划线价（不低于）": 168000, "日常价（不低于）": 151200, "小促价（不低于）": 134400, "大促价（不低于）": 109200, "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "洁面慕斯*2+润肤乳小样", "赠品": "贴纸", "旧SKU编码": "5263*2+5287*1+0020*1", "新改产品SKU编码": "5263*2+5287*1", "是否当前主推": "0", "划线价（不低于）": 168000, "日常价（不低于）": 151200, "小促价（不低于）": 134400, "大促价（不低于）": 109200, "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "润肤乳*2+冰沙霜小样", "赠品": "贴纸", "旧SKU编码": "5270*2+5294*1+0020*1", "新改产品SKU编码": "5270*2+5294*1", "是否当前主推": "0", "划线价（不低于）": 166400, "日常价（不低于）": 149760, "小促价（不低于）": 133120, "大促价（不低于）": 108160, "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "冰沙霜*2+润肤乳小样", "赠品": "贴纸", "旧SKU编码": "5256*2+5287*1+0020*1", "新改产品SKU编码": "5256*2+5287*1", "是否当前主推": "0", "划线价（不低于）": 181120, "日常价（不低于）": 163008, "小促价（不低于）": 144896, "大促价（不低于）": 117728, "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "洁面慕斯+润肤乳+冰沙霜小样", "赠品": "贴纸", "旧SKU编码": "5263*1+5270*1+5294*1+0020*1", "新改产品SKU编码": "5263*1+5270*1+5294*1", "是否当前主推": "0", "划线价（不低于）": 167200, "日常价（不低于）": 150480, "小促价（不低于）": 133760, "大促价（不低于）": 108680, "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "洁面慕斯+冰沙霜+润肤乳小样", "赠品": "贴纸", "旧SKU编码": "5263*1+5256*1+5287*1+0020*1", "新改产品SKU编码": "5263*1+5256*1+5287*1", "是否当前主推": "0", "划线价（不低于）": 174560, "日常价（不低于）": 157104, "小促价（不低于）": 139648, "大促价（不低于）": 113464, "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "洁面慕斯+冰沙霜+润肤乳（赠小样）", "赠品": "贴纸+冰沙霜小样+润肤乳小样", "旧SKU编码": "", "新改产品SKU编码": "5263*1+5270*1+5256*1+5294*1+5256*1", "是否当前主推": "0", "划线价（不低于）": 245760, "日常价（不低于）": 221184, "小促价（不低于）": 196608, "大促价（不低于）": 159744, "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "三合一赠送贴纸，挂件做促销", "产品经理": "叶温丽" },
  { "产品销售方案": "【敏感肌套装】洁面慕斯2+冰沙霜2+润肤乳3", "赠品": "贴纸+挂件", "旧SKU编码": "5263*2+5270*3+5256*2+0020*1+755168*1", "新改产品SKU编码": "5263*2+5270*3+5256*2", "是否当前主推": "", "划线价（不低于）": 538720, "日常价（不低于）": 484848, "小促价（不低于）": 430976, "大促价（不低于）": 377104, "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "【防晒套装】洁面慕斯1+冰沙霜3+润肤乳1", "赠品": "贴纸+挂件", "旧SKU编码": "5263*1+5270*1+5256*3+0020*1+755168*1", "新改产品SKU编码": "5263*1+5270*1+5256*3", "是否当前主推": "", "划线价（不低于）": 402880, "日常价（不低于）": 362592, "小促价（不低于）": 322304, "大促价（不低于）": 282016, "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "【运动套装】洁面慕斯3+冰沙霜2+润肤乳1", "赠品": "贴纸+挂件", "旧SKU编码": "5263*3+5270*1+5256*2+8000000020*1+755168*1", "新改产品SKU编码": "5263*3+5270*1+5256*2", "是否当前主推": "", "划线价（不低于）": 468320, "日常价（不低于）": 421488, "小促价（不低于）": 374656, "大促价（不低于）": 327824, "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "【家庭套装】洁面慕斯3+冰沙霜2+润肤乳4", "赠品": "贴纸+挂件", "旧SKU编码": "5263*3+5270*4+5256*2+0020*1+755168*1", "新改产品SKU编码": "5263*3+5270*4+5256*2", "是否当前主推": "", "划线价（不低于）": 681920, "日常价（不低于）": 613728, "小促价（不低于）": 545536, "大促价（不低于）": 477344, "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "【户外套装】洁面慕斯3+冰沙霜2+润肤乳3", "赠品": "贴纸+挂件", "旧SKU编码": "5263*3+5270*3+5256*2+0020*1+755168*1", "新改产品SKU编码": "5263*3+5270*3+5256*2", "是否当前主推": "", "划线价（不低于）": 610720, "日常价（不低于）": 549648, "小促价（不低于）": 488576, "大促价（不低于）": 427504, "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "【旅行套装】冰沙霜小样+润肤乳小样", "赠品": "/", "旧SKU编码": "5294*1+5287*1", "新改产品SKU编码": "5294*1+5287*1", "是否当前主推": "", "划线价（不低于）": 83920, "日常价（不低于）": 67136, "小促价（不低于）": "", "大促价（不低于）": "", "上线时间": "2025-08-08", "上线批次": "第一批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "防晒乳", "赠品": "防晒贴纸+铅笔", "旧SKU编码": "", "新改产品SKU编码": "8990144000016", "是否当前主推": "", "划线价（不低于）": 145760, "日常价（不低于）": 91100, "小促价（不低于）": 72880, "大促价（不低于）": 54660, "上线时间": "2026-04-11", "上线批次": "第二批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "防晒乳*2", "赠品": "防晒贴纸+铅笔+钥匙扣", "旧SKU编码": "", "新改产品SKU编码": "0016*2", "是否当前主推": "0", "划线价（不低于）": 280408, "日常价（不低于）": 200291, "小促价（不低于）": 140204, "大促价（不低于）": 100146, "上线时间": "2026-04-11", "上线批次": "第二批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "防晒乳*3", "赠品": "防晒贴纸+铅笔+挂件", "旧SKU编码": "", "新改产品SKU编码": "0016*3", "是否当前主推": "", "划线价（不低于）": 553354, "日常价（不低于）": 345847, "小促价（不低于）": 276677, "大促价（不低于）": 207508, "上线时间": "2026-04-11", "上线批次": "第二批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "防晒+冰沙霜", "赠品": "防晒贴纸+铅笔", "旧SKU编码": "", "新改产品SKU编码": "0016*1+5256*1", "是否当前主推": "", "划线价（不低于）": 271074, "日常价（不低于）": 193625, "小促价（不低于）": 135537, "大促价（不低于）": 96812, "上线时间": "2026-04-11", "上线批次": "第二批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "防晒+洁面", "赠品": "防晒贴纸+铅笔", "旧SKU编码": "", "新改产品SKU编码": "0016*1+5263*1", "是否当前主推": "", "划线价（不低于）": 256026, "日常价（不低于）": 160017, "小促价（不低于）": 128013, "大促价（不低于）": 96010, "上线时间": "2026-04-11", "上线批次": "第二批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "防晒+润肤乳", "赠品": "防晒贴纸+铅笔", "旧SKU编码": "", "新改产品SKU编码": "0016*1+5270*1", "是否当前主推": "", "划线价（不低于）": 253894, "日常价（不低于）": 158683, "小促价（不低于）": 126947, "大促价（不低于）": 95210, "上线时间": "2026-04-11", "上线批次": "第二批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "防晒+洁面+润肤乳", "赠品": "防晒贴纸+铅笔+挂件", "旧SKU编码": "", "新改产品SKU编码": "0016*1+5263*1+5270*1", "是否当前主推": "", "划线价（不低于）": 512288, "日常价（不低于）": 320180, "小促价（不低于）": 256144, "大促价（不低于）": 192108, "上线时间": "2026-04-11", "上线批次": "第二批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "防晒+冰沙霜+洁面+润肤乳", "赠品": "防晒贴纸+铅笔+水杯", "旧SKU编码": "", "新改产品SKU编码": "0016*1+5256*1+5263*1+5270*1", "是否当前主推": "", "划线价（不低于）": 607532, "日常价（不低于）": 379708, "小促价（不低于）": 303766, "大促价（不低于）": 227825, "上线时间": "2026-04-11", "上线批次": "第二批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "防晒+冰沙霜+洁面+润肤乳", "赠品": "防晒贴纸+铅笔+冰沙霜小样+润肤乳小样", "旧SKU编码": "", "新改产品SKU编码": "0016*1+5256*1+5263*1+5270*1+5294*1+5256*1", "是否当前主推": "0", "划线价（不低于）": 607532, "日常价（不低于）": 379708, "小促价（不低于）": 303766, "大促价（不低于）": 227825, "上线时间": "2026-04-11", "上线批次": "第二批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "防晒2+冰沙霜", "赠品": "防晒贴纸+铅笔+挂件", "旧SKU编码": "", "新改产品SKU编码": "0016*2+5256*1", "是否当前主推": "", "划线价（不低于）": 542688, "日常价（不低于）": 339180, "小促价（不低于）": 271344, "大促价（不低于）": 203508, "上线时间": "2026-04-11", "上线批次": "第二批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "防晒2+洁面+润肤乳", "赠品": "防晒贴纸+铅笔+挂件", "旧SKU编码": "", "新改产品SKU编码": "0016*2+5263*1+5270*1", "是否当前主推": "", "划线价（不低于）": 683746, "日常价（不低于）": 427341, "小促价（不低于）": 341873, "大促价（不低于）": 256405, "上线时间": "2026-04-11", "上线批次": "第二批", "备注": "", "产品经理": "叶温丽" },
  { "产品销售方案": "防晒3+洁面+润肤乳2", "赠品": "防晒贴纸+铅笔+挂件", "旧SKU编码": "", "新改产品SKU编码": "0016*3+5263*1+5270*2", "是否当前主推": "", "划线价（不低于）": 921612, "日常价（不低于）": 576008, "小促价（不低于）": 460806, "大促价（不低于）": 345605, "上线时间": "2026-04-11", "上线批次": "第二批", "备注": "", "产品经理": "叶温丽" }
];

// ─── 内置赠品库数据：来自「🎉项目概况表_产品_🎁 赠品库.xlsx」──────────────
const GIFT_DATA = [
  { name: "品牌物流箱", sku: "80000013", costCny: 1.1 },
  { name: "贴纸", sku: "80000020", costCny: 1 },
  { name: "铅笔", sku: "80000037", costCny: 0.491 },
  { name: "水杯（粉紫色）", sku: "80000044", costCny: 10.969 },
  { name: "挂件挂件-天使信者", sku: "80000051", costCny: 11.1096 },
  { name: "挂件盲袋-星际旅者", sku: "80000068", costCny: 11.1096 },
  { name: "挂件盲袋-浪趣玩家", sku: "80000075", costCny: 11.1096 },
  { name: "伸缩购物袋-橙色", sku: "80000082", costCny: 5.5 },
  { name: "伸缩购物袋-紫色", sku: "80000099", costCny: 5 },
  { name: "环保购物袋", sku: "80000105", costCny: 4.5 },
  { name: "亚克力钥匙扣", sku: "80000112", costCny: 3.373 },
  { name: "洗漱包", sku: "80000129", costCny: 5.073 },
  { name: "沐浴球", sku: "80000136", costCny: 2.583 },
  { name: "品牌物流箱插画版", sku: "80000143", costCny: 2.08 },
  { name: "香薰片（柚香芬芳）", sku: "80000150", costCny: 2.603 },
  { name: "豪华礼盒-2025版", sku: "80000167", costCny: 2.78 },
  { name: "礼盒用封口贴", sku: "80000174", costCny: 0.11 },
  { name: "礼盒用品牌关怀卡片", sku: "80000181", costCny: 0.24 },
  { name: "新水杯（橙绿）", sku: "80000198", costCny: 8.2 },
  { name: "UV感应贴纸", sku: "80000204", costCny: 0.88 }
];

// ─── DOM refs ────────────────────────────────────────────────
const els = {
  dataStatus:     document.getElementById("dataStatus"),
  kpiGrid:        document.getElementById("kpiGrid"),
  calcRows:       document.getElementById("calcRows"),
  addCalcRow:     document.getElementById("addCalcRow"),
  giftRows:       document.getElementById("giftRows"),
  addGiftRow:     document.getElementById("addGiftRow"),
  calculateBtn:   document.getElementById("calculateBtn"),
  clearCalcBtn:   document.getElementById("clearCalcBtn"),
  calcResult:     document.getElementById("calcResult"),
  grandTotal:     document.getElementById("grandTotal"),
  calcMeta:       document.getElementById("calcMeta"),
  detailSection:  document.getElementById("detailSection"),
  searchInput:    document.getElementById("searchInput"),
  batchFilter:    document.getElementById("batchFilter"),
  typeFilter:     document.getElementById("typeFilter"),
  mainPushFilter: document.getElementById("mainPushFilter"),
  sortSelect:     document.getElementById("sortSelect"),
  resetFilters:   document.getElementById("resetFilters"),
  tableBody:      document.getElementById("costTableBody"),
  tableMeta:      document.getElementById("tableMeta"),
  exportBtn:      document.getElementById("exportBtn"),
  lookupInput:    document.getElementById("lookupInput"),
  lookupBtn:      document.getElementById("lookupBtn"),
  lookupClear:    document.getElementById("lookupClear"),
  lookupResult:   document.getElementById("lookupResult"),
  currencyButtons: document.querySelectorAll("[data-currency]"),
  langButtons:    document.querySelectorAll("[data-lang]")
};

const COL = {
  plan:       "产品销售方案",
  gift:       "赠品",
  oldSku:     "旧SKU编码",
  newSku:     "新改产品SKU编码",
  mainPush:   "是否当前主推",
  listPrice:  "划线价（不低于）",
  dailyPrice: "日常价（不低于）",
  smallPromo: "小促价（不低于）",
  bigPromo:   "大促价（不低于）",
  launchDate: "上线时间",
  batch:      "上线批次",
  notes:      "备注",
  pm:         "产品经理"
};

let allRows  = PRICING_DATA.slice(); // 工作副本
let viewRows = [];
let calcRows = [{ id: 1, rowIndex: "", qty: 1 }];
let giftCalcRows = [{ id: 1, giftIndex: "", qty: 1 }];
let selectedCalcLines = [];
let selectedGiftLines = [];
let nextCalcRowId = 2;
let nextGiftRowId = 2;
const FX_IDR_PER_CNY = 2500;
let displayCurrency = localStorage.getItem("currency") || "IDR";

const tt = (key, vars) => {
  if (typeof window.t === "function") return window.t(key, vars);
  return key;
};

function escapeHtml(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function convertMoney(value, baseCurrency = "IDR") {
  const num = parseFloat(value);
  if (!isFinite(num)) return 0;
  if (displayCurrency === baseCurrency) return num;
  if (baseCurrency === "IDR" && displayCurrency === "CNY") return num / FX_IDR_PER_CNY;
  if (baseCurrency === "CNY" && displayCurrency === "IDR") return num * FX_IDR_PER_CNY;
  return num;
}

function fmtCurrency(n, baseCurrency = "IDR") {
  const num = parseFloat(n);
  if (!isFinite(num) || num === 0) return "—";
  const converted = convertMoney(num, baseCurrency);
  if (displayCurrency === "CNY") {
    return `${converted.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CNY`;
  }
  return `${Math.round(converted).toLocaleString("zh-CN")} IDR`;
}

function fmtNumber(n) {
  const num = parseFloat(n);
  if (!isFinite(num)) return "0";
  return Math.round(num).toLocaleString("zh-CN");
}

function fmtZeroCurrency() {
  return displayCurrency === "CNY" ? "0.00 CNY" : "0 IDR";
}

function fmtDate(v) {
  if (v === null || v === undefined || v === "") return "—";
  if (v instanceof Date) {
    const y = v.getFullYear(), m = String(v.getMonth() + 1).padStart(2, "0"), d = String(v.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  if (typeof v === "number") {
    const d = new Date((v - 25569) * 86400 * 1000);
    return fmtDate(d);
  }
  return String(v).slice(0, 10);
}

// ─── 字段判定 ───────────────────────────────────────────────
function isMainPush(row) {
  const v = row[COL.mainPush];
  if (v === 1 || v === "1" || v === true) return true;
  return false;
}

function classifyType(row) {
  const sku   = String(row[COL.newSku] || "").trim();
  const plan  = String(row[COL.plan]   || "").trim();
  // 套装：SKU 编码含 "+" 或 "*"（多 SKU 组合）
  if (sku.includes("+") || /\*[2-9]/.test(sku)) return "bundle";
  // 小样：方案名含"小样"
  if (/小样/.test(plan)) return "sample";
  return "single";
}

function typeLabel(type) {
  return { single: "单品", bundle: "套装", sample: "小样" }[type] || "—";
}

function typeColor(type) {
  return { single: "#62B89A", bundle: "#9A7BE8", sample: "#FFB5A0" }[type] || "#9aa3b2";
}

function cnyToIdr(value) {
  const n = parseFloat(value);
  return isFinite(n) ? n * FX_IDR_PER_CNY : 0;
}

function unitLandedCost(row) {
  return productUnitCost(row) + giftUnitCostIdr(row);
}

function productUnitCost(row) {
  return parseFloat(row[COL.dailyPrice]) || 0;
}

function getGiftByName(name) {
  return GIFT_DATA.find(g => g.name === name) || null;
}

function giftDisplayName(gift) {
  if (!gift) return "";
  if (gift.name.includes("挂件")) return "挂件";
  if (gift.name.includes("水杯")) return "水杯";
  if (gift.name.includes("钥匙扣")) return "钥匙扣";
  if (gift.name.includes("UV感应贴纸")) return "防晒贴纸";
  return gift.name;
}

function matchGiftToken(token) {
  const t = String(token || "").trim();
  if (!t || t === "/") return null;
  const exact = getGiftByName(t);
  if (exact) return exact;
  if (t.includes("防晒贴纸")) return getGiftByName("UV感应贴纸");
  if (t.includes("钥匙扣")) return getGiftByName("亚克力钥匙扣");
  if (t.includes("挂件")) return getGiftByName("挂件挂件-天使信者");
  if (t.includes("水杯")) return getGiftByName("水杯（粉紫色）");
  if (t.includes("贴纸")) return getGiftByName("贴纸");
  if (t.includes("铅笔")) return getGiftByName("铅笔");
  return null;
}

function matchSampleGiftToken(token) {
  const t = String(token || "").trim();
  if (!t) return null;
  return allRows.find(r => String(r[COL.plan] || "").trim() === t && classifyType(r) === "sample") || null;
}

function giftItemsForRow(row) {
  const giftText = String(row[COL.gift] || "").trim();
  if (!giftText || giftText === "/") return [];
  const items = [];
  giftText.split("+").map(v => v.trim()).filter(Boolean).forEach(token => {
    const sample = matchSampleGiftToken(token);
    if (sample) {
      items.push({
        name: token,
        sku: sample[COL.newSku] || "",
        unitIdr: productUnitCost(sample),
        unitCny: productUnitCost(sample) / FX_IDR_PER_CNY,
        source: "产品小样"
      });
      return;
    }
    const gift = matchGiftToken(token);
    if (!gift) {
      items.push({ name: token, sku: "", unitIdr: 0, unitCny: 0, source: "未匹配" });
      return;
    }
    items.push({
      name: giftDisplayName(gift),
      sku: gift.sku,
      unitIdr: cnyToIdr(gift.costCny),
      unitCny: gift.costCny,
      source: "赠品库"
    });
  });
  return items;
}

function giftUnitCostIdr(row) {
  return giftItemsForRow(row).reduce((sum, item) => sum + (parseFloat(item.unitIdr) || 0), 0);
}

function giftSummary(row) {
  const items = giftItemsForRow(row);
  if (!items.length) return "—";
  return items.map(item => {
    const sku = item.sku ? ` / ${item.sku}` : "";
    return `${item.name}${sku} / ${fmtCurrency(item.unitIdr)}`;
  }).join("；");
}

function getDuplicatePlanCount(plan) {
  return allRows.filter(r => String(r[COL.plan] || "") === String(plan || "")).length;
}

function productOptionLabel(row) {
  const plan = String(row[COL.plan] || "");
  const gift = String(row[COL.gift] || "").trim();
  const sku = String(row[COL.newSku] || "").trim();
  if (getDuplicatePlanCount(plan) > 1 && gift && gift !== "/") return `${plan}（${gift}）`;
  if (getDuplicatePlanCount(plan) > 1 && sku) return `${plan}（${sku}）`;
  return plan;
}

// ─── 到岸成本计算器 ─────────────────────────────────────────
function renderCalculatorRows() {
  if (!els.calcRows) return;
  const options = allRows.map((row, idx) =>
    `<option value="${idx}">${escapeHtml(productOptionLabel(row))}</option>`
  ).join("");

  els.calcRows.innerHTML = calcRows.map((line, idx) => `
    <div class="calc-line" data-id="${line.id}">
      <div class="calc-token">${String(idx + 1).padStart(2, "0")}</div>
      <div class="calc-field calc-product">
        <label>产品中文名</label>
        <select class="select calc-product-select">
          <option value="">选择产品</option>
          ${options}
        </select>
      </div>
      <div class="calc-field calc-qty">
        <label>数量</label>
        <input class="calc-qty-input" type="number" min="1" step="1" value="${escapeHtml(line.qty || 1)}" />
      </div>
      <button class="calc-remove" type="button" aria-label="删除此行" ${calcRows.length === 1 ? "disabled" : ""}>×</button>
    </div>
  `).join("");

  calcRows.forEach(line => {
    const el = els.calcRows.querySelector(`.calc-line[data-id="${line.id}"] .calc-product-select`);
    if (el) el.value = line.rowIndex;
  });
}

function renderGiftRows() {
  if (!els.giftRows) return;
  const options = GIFT_DATA.map((gift, idx) =>
    `<option value="${idx}">${escapeHtml(giftDisplayName(gift))}（${escapeHtml(gift.sku)}）</option>`
  ).join("");

  els.giftRows.innerHTML = giftCalcRows.map((line, idx) => `
    <div class="calc-line gift-line" data-id="${line.id}">
      <div class="calc-token gift-token">${String(idx + 1).padStart(2, "0")}</div>
      <div class="calc-field calc-product">
        <label>赠品中文名</label>
        <select class="select gift-product-select">
          <option value="">选择赠品</option>
          ${options}
        </select>
      </div>
      <div class="calc-field calc-qty">
        <label>数量</label>
        <input class="gift-qty-input" type="number" min="1" step="1" value="${escapeHtml(line.qty || 1)}" />
      </div>
      <button class="calc-remove gift-remove" type="button" aria-label="删除此赠品行" ${giftCalcRows.length === 1 ? "disabled" : ""}>×</button>
    </div>
  `).join("");

  giftCalcRows.forEach(line => {
    const el = els.giftRows.querySelector(`.calc-line[data-id="${line.id}"] .gift-product-select`);
    if (el) el.value = line.giftIndex;
  });
}

function syncCalculatorStateFromDOM() {
  if (!els.calcRows) return;
  calcRows = Array.from(els.calcRows.querySelectorAll(".calc-line")).map(line => {
    const id = parseInt(line.dataset.id, 10);
    const select = line.querySelector(".calc-product-select");
    const qtyInput = line.querySelector(".calc-qty-input");
    const qty = Math.max(1, Math.floor(parseFloat(qtyInput.value) || 1));
    return { id, rowIndex: select.value, qty };
  });
}

function syncGiftStateFromDOM() {
  if (!els.giftRows) return;
  giftCalcRows = Array.from(els.giftRows.querySelectorAll(".calc-line")).map(line => {
    const id = parseInt(line.dataset.id, 10);
    const select = line.querySelector(".gift-product-select");
    const qtyInput = line.querySelector(".gift-qty-input");
    const qty = Math.max(1, Math.floor(parseFloat(qtyInput.value) || 1));
    return { id, giftIndex: select.value, qty };
  });
}

function getCalculatorItems() {
  syncCalculatorStateFromDOM();
  const grouped = new Map();
  calcRows.forEach(line => {
    if (line.rowIndex === "") return;
    const rowIndex = parseInt(line.rowIndex, 10);
    const row = allRows[rowIndex];
    if (!row) return;
    const old = grouped.get(rowIndex) || { rowIndex, row, qty: 0 };
    old.qty += Math.max(1, Math.floor(line.qty || 1));
    grouped.set(rowIndex, old);
  });
  return Array.from(grouped.values()).map(item => ({
    ...item,
    productUnit: productUnitCost(item.row),
    giftUnit: giftUnitCostIdr(item.row),
    giftItems: giftItemsForRow(item.row),
    unit: unitLandedCost(item.row),
    productSubtotal: productUnitCost(item.row) * item.qty,
    giftSubtotal: giftUnitCostIdr(item.row) * item.qty,
    subtotal: unitLandedCost(item.row) * item.qty
  }));
}

function getGiftCalculatorItems() {
  syncGiftStateFromDOM();
  const grouped = new Map();
  giftCalcRows.forEach(line => {
    if (line.giftIndex === "") return;
    const giftIndex = parseInt(line.giftIndex, 10);
    const gift = GIFT_DATA[giftIndex];
    if (!gift) return;
    const old = grouped.get(giftIndex) || { giftIndex, gift, qty: 0 };
    old.qty += Math.max(1, Math.floor(line.qty || 1));
    grouped.set(giftIndex, old);
  });
  return Array.from(grouped.values()).map(item => {
    const unitIdr = cnyToIdr(item.gift.costCny);
    return {
      ...item,
      name: giftDisplayName(item.gift),
      sku: item.gift.sku,
      unitIdr,
      subtotal: unitIdr * item.qty
    };
  });
}

function renderCalculatorResult(items) {
  const extraGifts = selectedGiftLines;
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const giftQty = extraGifts.reduce((sum, item) => sum + item.qty, 0);
  const extraGiftTotal = extraGifts.reduce((sum, item) => sum + item.subtotal, 0);
  const total = items.reduce((sum, item) => sum + item.subtotal, 0) + extraGiftTotal;
  const productTotal = items.reduce((sum, item) => sum + item.productSubtotal, 0);
  const planGiftTotal = items.reduce((sum, item) => sum + item.giftSubtotal, 0);
  const giftTotal = planGiftTotal + extraGiftTotal;
  if (els.grandTotal) els.grandTotal.textContent = fmtCurrency(total);
  if (els.calcMeta) els.calcMeta.textContent = `${items.length} 个产品 · ${totalQty} 件 / ${extraGifts.length} 种赠品 · ${giftQty} 件`;
  if (!els.calcResult) return;

  els.calcResult.hidden = false;
  els.calcResult.innerHTML = `
    <div class="calc-result-head">
      <div>
        <span class="calc-result-label">本次合计</span>
        <strong>${fmtCurrency(total)}</strong>
      </div>
      <span>${items.length} 个产品 / ${totalQty} 件 · ${extraGifts.length} 种赠品 / ${giftQty} 件</span>
    </div>
    <div class="calc-total-split">
      <div><span>产品成本</span><strong>${fmtCurrency(productTotal)}</strong></div>
      <div><span>赠品成本</span><strong>${fmtCurrency(giftTotal)}</strong></div>
      <div><span>总到岸成本</span><strong>${fmtCurrency(total)}</strong></div>
    </div>
    <div class="calc-mini-list">
      ${items.map(item => `
        <div class="calc-mini-row">
          <span>
            <strong>${escapeHtml(item.row[COL.plan])}</strong>
            <small>${escapeHtml(giftSummary(item.row))}</small>
          </span>
          <span>产品 ${fmtCurrency(item.productUnit)} + 赠品 ${fmtCurrency(item.giftUnit)} × ${fmtNumber(item.qty)}</span>
          <strong>${fmtCurrency(item.subtotal)}</strong>
        </div>
      `).join("")}
      ${extraGifts.map(item => `
        <div class="calc-mini-row gift-mini-row">
          <span>
            <strong>${escapeHtml(item.name)}</strong>
            <small>${escapeHtml(item.sku)} / 赠品库</small>
          </span>
          <span>赠品 ${fmtCurrency(item.unitIdr)} × ${fmtNumber(item.qty)}</span>
          <strong>${fmtCurrency(item.subtotal)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function hideCalculationDetails() {
  selectedCalcLines = [];
  selectedGiftLines = [];
  viewRows = [];
  if (els.detailSection) els.detailSection.hidden = true;
  if (els.calcResult) els.calcResult.hidden = true;
  if (els.grandTotal) els.grandTotal.textContent = fmtZeroCurrency();
  if (els.calcMeta) els.calcMeta.textContent = "选择产品和数量后开始计算";
}

function calculateLandedCost() {
  const items = getCalculatorItems();
  const gifts = getGiftCalculatorItems();
  if (!items.length && !gifts.length) {
    alert("请先选择至少 1 个产品或赠品");
    return;
  }
  selectedCalcLines = items;
  selectedGiftLines = gifts;
  if (els.detailSection) els.detailSection.hidden = false;
  renderCalculatorResult(items);
  applyFilters();
}

function updateCurrencyButtons() {
  els.currencyButtons.forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-currency") === displayCurrency);
  });
}

function rerenderMoneyViews() {
  if (selectedCalcLines.length) {
    renderCalculatorResult(selectedCalcLines);
    renderTable();
  } else if (selectedGiftLines.length) {
    renderCalculatorResult(selectedCalcLines);
    renderTable();
  } else if (els.grandTotal) {
    els.grandTotal.textContent = fmtZeroCurrency();
  }
}

function setCurrency(next) {
  if (!next || next === displayCurrency) return;
  displayCurrency = next;
  localStorage.setItem("currency", displayCurrency);
  updateCurrencyButtons();
  rerenderMoneyViews();
}

// ─── KPI ────────────────────────────────────────────────────
function renderKPIs() {
  if (!els.kpiGrid) return;
  const total    = allRows.length;
  const mainPush = allRows.filter(isMainPush).length;
  const singles  = allRows.filter(r => classifyType(r) === "single").length;
  const bundles  = allRows.filter(r => classifyType(r) === "bundle").length;
  const samples  = allRows.filter(r => classifyType(r) === "sample").length;

  // 价格统计（仅基于日常价）
  const dailyPrices = allRows.map(r => parseFloat(r[COL.dailyPrice]) || 0).filter(v => v > 0);
  const avgDaily = dailyPrices.length ? dailyPrices.reduce((s, v) => s + v, 0) / dailyPrices.length : 0;
  const maxDaily = dailyPrices.length ? Math.max(...dailyPrices) : 0;
  const minDaily = dailyPrices.length ? Math.min(...dailyPrices) : 0;

  const kpis = [
    { label: "价格条目总数", value: total.toLocaleString(),  note: "全部销售方案" },
    { label: "主推产品",     value: mainPush.toLocaleString(), note: "是否当前主推 = 1" },
    { label: "单品 SKU",     value: singles.toLocaleString(), note: "无 + / *" },
    { label: "套装 SKU",     value: bundles.toLocaleString(), note: "含 + 或 *N" },
    { label: "小样 SKU",     value: samples.toLocaleString(), note: "方案名含「小样」" },
    { label: "平均日常价",   value: fmtCurrency(avgDaily),  note: "日常价均值" },
    { label: "日常价区间",   value: `${fmtCurrency(minDaily)} ~ ${fmtCurrency(maxDaily)}`, note: "min ~ max" },
    { label: "数据来源",     value: "jia.xlsx",             note: "产品经理维护" }
  ];
  els.kpiGrid.innerHTML = kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-title">${escapeHtml(k.label)}</div>
      <div class="kpi-value">${escapeHtml(k.value)}</div>
      <div class="kpi-note">${escapeHtml(k.note)}</div>
    </div>`).join("");
}

// ─── 批次下拉填充 ───────────────────────────────────────────
function populateBatchFilter() {
  if (!els.batchFilter) return;
  const batches = [...new Set(allRows.map(r => String(r[COL.batch] || "").trim()).filter(Boolean))].sort();
  const cur = els.batchFilter.value;
  els.batchFilter.innerHTML = `<option value="">全部</option>` +
    batches.map(b => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`).join("");
  if (cur && batches.includes(cur)) els.batchFilter.value = cur;
}

// ─── Filters & Sort ─────────────────────────────────────────
function applyFilters() {
  if (!selectedCalcLines.length) {
    viewRows = [];
    renderTable();
    return;
  }
  const kw      = (els.searchInput.value || "").trim().toLowerCase();
  const batch   = els.batchFilter.value;
  const type    = els.typeFilter.value;
  const mainPv  = els.mainPushFilter.value;
  const selectedRows = selectedCalcLines.map(item => item.row);

  viewRows = selectedRows.filter(r => {
    if (kw) {
      const hay = [
        r[COL.plan], r[COL.gift], r[COL.oldSku], r[COL.newSku],
        r[COL.notes], r[COL.batch]
      ].map(v => String(v || "").toLowerCase()).join(" | ");
      if (!hay.includes(kw)) return false;
    }
    if (batch && String(r[COL.batch] || "").trim() !== batch) return false;
    if (type) {
      if (classifyType(r) !== type) return false;
    }
    if (mainPv === "yes" && !isMainPush(r)) return false;
    if (mainPv === "no"  &&  isMainPush(r)) return false;
    return true;
  });

  const sortKey = els.sortSelect.value;
  const sorters = {
    default:    (a, b) => selectedRows.indexOf(a) - selectedRows.indexOf(b),
    daily_desc: (a, b) => (parseFloat(b[COL.dailyPrice]) || 0) - (parseFloat(a[COL.dailyPrice]) || 0),
    daily_asc:  (a, b) => (parseFloat(a[COL.dailyPrice]) || 0) - (parseFloat(b[COL.dailyPrice]) || 0),
    big_desc:   (a, b) => (parseFloat(b[COL.bigPromo])   || 0) - (parseFloat(a[COL.bigPromo])   || 0),
    list_desc:  (a, b) => (parseFloat(b[COL.listPrice])  || 0) - (parseFloat(a[COL.listPrice])  || 0)
  };
  viewRows.sort(sorters[sortKey] || sorters.default);

  renderTable();
}

function renderTable() {
  if (!els.tableMeta || !els.tableBody) return;
  const total = selectedCalcLines.length;
  els.tableMeta.textContent = `显示 ${viewRows.length.toLocaleString()} / ${total.toLocaleString()} 条`;

  if (!viewRows.length) {
    els.tableBody.innerHTML = `<tr><td colspan="15" style="text-align:center;color:#9aa3b2;padding:32px">无匹配记录</td></tr>`;
    return;
  }

  els.tableBody.innerHTML = viewRows.map(r => {
    const type = classifyType(r);
    const main = isMainPush(r);
    const calcLine = selectedCalcLines.find(item => item.row === r);
    const qty = calcLine ? calcLine.qty : 1;
    const subtotal = calcLine ? calcLine.subtotal : unitLandedCost(r);
    const giftUnit = calcLine ? calcLine.giftUnit : giftUnitCostIdr(r);
    return `
      <tr>
        <td>
          <div class="product-name" style="font-weight:700">${escapeHtml(r[COL.plan])}</div>
          <div style="font-size:11px;margin-top:3px">
            <span class="status-badge" style="background:${typeColor(type)};color:#0E0E0E">${escapeHtml(typeLabel(type))}</span>
          </div>
        </td>
        <td class="order-id" style="font-family:monospace;font-size:12px">${escapeHtml(r[COL.newSku])}</td>
        <td class="order-id" style="font-family:monospace;font-size:11px;color:#5E5E5E">${escapeHtml(r[COL.oldSku] || "—")}</td>
        <td style="font-size:12px">${escapeHtml(r[COL.gift] || "—")}</td>
        <td style="font-size:11px;color:#5E5E5E;min-width:180px">${escapeHtml(giftSummary(r))}</td>
        <td class="amount-cell">${escapeHtml(fmtNumber(qty))}</td>
        <td>${main ? '<span class="sample-badge" style="background:#FFD93D;color:#0E0E0E">主推</span>' : "—"}</td>
        <td class="amount-cell">${fmtCurrency(r[COL.listPrice])}</td>
        <td class="amount-cell" style="color:#FF7500;font-weight:700">${fmtCurrency(r[COL.dailyPrice])}</td>
        <td class="amount-cell">${fmtCurrency(r[COL.smallPromo])}</td>
        <td class="amount-cell">${fmtCurrency(r[COL.bigPromo])}</td>
        <td class="amount-cell" style="color:#9A7BE8;font-weight:900">${fmtCurrency(giftUnit)}</td>
        <td class="amount-cell" style="color:#2FB985;font-weight:900">${fmtCurrency(subtotal)}</td>
        <td style="font-size:12px">${escapeHtml(r[COL.batch] || "—")}</td>
        <td style="font-size:11px;color:#5E5E5E">${escapeHtml(r[COL.notes] || "")}</td>
      </tr>`;
  }).join("");
}

// ─── SKU 组合匹配辅助 ───────────────────────────────────────
// 把 "5263*1+5256*1" / "0016*2" 这种组合拆成 {code, qty} 数组
function parseComposition(text) {
  const cleaned = String(text || "").replace(/\s|\n/g, "").trim();
  if (!cleaned) return [];
  return cleaned.split("+").map(part => {
    const m = part.match(/^(.+?)\*(\d+)$/);
    if (m) return { code: m[1].trim(), qty: parseInt(m[2], 10) || 1 };
    return { code: part.trim(), qty: 1 };
  }).filter(c => c.code);
}

// 找单品记录：匹配新 SKU 或旧 SKU 的"基础码"
function findSingleByCode(code) {
  const c = String(code).trim();
  if (!c) return null;
  // 1) 完全匹配新 SKU
  let hit = allRows.find(r => String(r[COL.newSku] || "").trim() === c);
  if (hit) return hit;
  // 2) 新 SKU 以 code 结尾（处理"5263" → "8995107505263"）
  hit = allRows.find(r => {
    const sku = String(r[COL.newSku] || "").trim();
    if (sku.includes("+") || sku.includes("*")) return false; // 排除套装
    return sku.endsWith(c) || sku.includes(c);
  });
  if (hit) return hit;
  // 3) 旧 SKU 直接精确匹配
  hit = allRows.find(r => String(r[COL.oldSku] || "").trim() === c);
  return hit || null;
}

function findBundleByComposition(text) {
  const norm = String(text || "").replace(/\s|\n/g, "").trim();
  if (!norm) return null;
  return allRows.find(r => {
    const newS = String(r[COL.newSku] || "").replace(/\s|\n/g, "").trim();
    const oldS = String(r[COL.oldSku] || "").replace(/\s|\n/g, "").trim();
    return newS === norm || oldS === norm;
  }) || null;
}

function renderLookupResult() {
  const text = (els.lookupInput.value || "").trim();
  if (!text) { els.lookupResult.innerHTML = ""; return; }

  const bundle = findBundleByComposition(text);
  const isComposition = text.includes("+") || /\*\d+/.test(text);

  let cards = [];

  if (bundle) {
    cards.push({
      icon: "🎯",
      title: "整体匹配",
      cls: "ct-Video",
      row: bundle
    });
  }

  if (isComposition) {
    const parts = parseComposition(text);
    const itemBlocks = [];
    let sumList = 0, sumDaily = 0, sumSmall = 0, sumBig = 0;
    let allFound = true;

    parts.forEach(p => {
      const single = findSingleByCode(p.code);
      if (!single) {
        itemBlocks.push(`<div class="ct-foot" style="color:#F27A5C">⚠ 未找到 SKU: ${escapeHtml(p.code)}</div>`);
        allFound = false;
        return;
      }
      const list  = (parseFloat(single[COL.listPrice])  || 0) * p.qty;
      const daily = (parseFloat(single[COL.dailyPrice]) || 0) * p.qty;
      const small = (parseFloat(single[COL.smallPromo]) || 0) * p.qty;
      const big   = (parseFloat(single[COL.bigPromo])   || 0) * p.qty;
      sumList += list; sumDaily += daily; sumSmall += small; sumBig += big;

      itemBlocks.push(`
        <div style="border-top:1px dashed rgba(0,0,0,0.1);padding:8px 0;font-size:13px">
          <div><strong>${escapeHtml(single[COL.plan])}</strong> × ${p.qty}
            <span style="color:#9aa3b2;font-size:11px;margin-left:6px">[${escapeHtml(p.code)}]</span></div>
          <div style="display:flex;gap:12px;font-size:11px;color:#5E5E5E;margin-top:3px">
            <span>日常 ${fmtCurrency(daily)}</span>
            <span>小促 ${fmtCurrency(small)}</span>
            <span>大促 ${fmtCurrency(big)}</span>
          </div>
        </div>
      `);
    });

    if (parts.length) {
      cards.push({
        icon: "🧮",
        title: "按单品累加（如非套装价）",
        cls: "ct-External",
        custom: `
          <div style="padding:0 4px">${itemBlocks.join("")}</div>
          <div class="ct-stats" style="margin-top:10px;border-top:2px solid #0E0E0E;padding-top:10px">
            <div class="ct-stat"><div class="ct-stat-v">${fmtCurrency(sumList)}</div><div class="ct-stat-l">划线合计</div></div>
            <div class="ct-stat"><div class="ct-stat-v" style="color:#FF7500">${fmtCurrency(sumDaily)}</div><div class="ct-stat-l">日常合计</div></div>
            <div class="ct-stat"><div class="ct-stat-v">${fmtCurrency(sumSmall)}</div><div class="ct-stat-l">小促合计</div></div>
            <div class="ct-stat"><div class="ct-stat-v">${fmtCurrency(sumBig)}</div><div class="ct-stat-l">大促合计</div></div>
          </div>
          ${bundle ? `
            <div class="ct-foot" style="margin-top:10px;background:rgba(255,217,61,0.2);padding:8px;border-radius:8px">
              💡 套装日常价 ${fmtCurrency(bundle[COL.dailyPrice])} · 单品累加 ${fmtCurrency(sumDaily)}
              ${(parseFloat(bundle[COL.dailyPrice]) || 0) < sumDaily
                ? ` · <strong style="color:#62B89A">套装省 ${fmtCurrency(sumDaily - (parseFloat(bundle[COL.dailyPrice]) || 0))}</strong>`
                : ""}
            </div>` : ""}
        `
      });
    }
  } else if (!bundle) {
    const single = findSingleByCode(text);
    if (single) {
      cards.push({ icon: "🎯", title: "匹配", cls: "ct-Showcase", row: single });
    }
  }

  if (!cards.length) {
    els.lookupResult.innerHTML = `<div class="ct-card ct-External" style="grid-column:1/-1">
      <div class="ct-card-head"><span class="ct-icon">❓</span><span class="ct-name">未找到匹配</span></div>
      <div class="ct-foot"><span>试试输入完整新 SKU（如 8995107505263）或组合编码（如 5263*1+5256*1）</span></div>
    </div>`;
    return;
  }

  els.lookupResult.innerHTML = cards.map(c => {
    if (c.custom) {
      return `<div class="ct-card ${c.cls}" style="grid-column:1/-1">
        <div class="ct-card-head">
          <span class="ct-icon">${c.icon}</span>
          <span class="ct-name">${escapeHtml(c.title)}</span>
        </div>
        ${c.custom}
      </div>`;
    }
    const r = c.row;
    return `<div class="ct-card ${c.cls}">
      <div class="ct-card-head">
        <span class="ct-icon">${c.icon}</span>
        <span class="ct-name">${escapeHtml(r[COL.plan])}</span>
        ${isMainPush(r) ? '<span class="sample-badge" style="background:#FFD93D;color:#0E0E0E">主推</span>' : ""}
      </div>
      <div class="ct-stats">
        <div class="ct-stat"><div class="ct-stat-v">${fmtCurrency(r[COL.listPrice])}</div><div class="ct-stat-l">划线价</div></div>
        <div class="ct-stat"><div class="ct-stat-v" style="color:#FF7500">${fmtCurrency(r[COL.dailyPrice])}</div><div class="ct-stat-l">日常价</div></div>
        <div class="ct-stat"><div class="ct-stat-v">${fmtCurrency(r[COL.smallPromo])}</div><div class="ct-stat-l">小促价</div></div>
        <div class="ct-stat"><div class="ct-stat-v">${fmtCurrency(r[COL.bigPromo])}</div><div class="ct-stat-l">大促价</div></div>
      </div>
      <div class="ct-foot">
        <span>新 SKU: <strong>${escapeHtml(r[COL.newSku])}</strong></span>
        ${r[COL.gift] ? `<span>赠品: ${escapeHtml(r[COL.gift])}</span>` : ""}
      </div>
    </div>`;
  }).join("");
}

// ─── Export CSV ──────────────────────────────────────────────
function exportCSV() {
  if (!viewRows.length) { alert("没有数据可导出"); return; }
  const headers = [
    "销售方案", "新SKU编码", "旧SKU编码", "赠品", "赠品明细", "数量", "是否主推",
    "划线价", "日常价", "小促价", "大促价", "赠品成本/件", "到岸小计", "上线时间", "上线批次", "备注", "产品经理"
  ];
  const data = viewRows.map(r => {
    const calcLine = selectedCalcLines.find(item => item.row === r);
    const qty = calcLine ? calcLine.qty : 1;
    const subtotal = calcLine ? calcLine.subtotal : unitLandedCost(r);
    const giftUnit = calcLine ? calcLine.giftUnit : giftUnitCostIdr(r);
    return [
      r[COL.plan]       || "",
      r[COL.newSku]     || "",
      r[COL.oldSku]     || "",
      r[COL.gift]       || "",
      giftSummary(r),
      qty,
      isMainPush(r) ? "是" : "否",
      parseFloat(r[COL.listPrice])  || "",
      parseFloat(r[COL.dailyPrice]) || "",
      parseFloat(r[COL.smallPromo]) || "",
      parseFloat(r[COL.bigPromo])   || "",
      giftUnit || "",
      subtotal || "",
      fmtDate(r[COL.launchDate]),
      r[COL.batch]      || "",
      r[COL.notes]      || "",
      r[COL.pm]         || ""
    ];
  });

  const csv = [headers, ...data]
    .map(row => row.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\r\n");

  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);
  link.download = `cuscus-价格库_${dateStr}.csv`;
  link.click();
}

// ─── 事件绑定 ──────────────────────────────────────────────
[els.searchInput, els.batchFilter, els.typeFilter, els.mainPushFilter, els.sortSelect].forEach(el => {
  if (!el) return;
  el.addEventListener(el.tagName === "INPUT" ? "input" : "change", applyFilters);
});

if (els.resetFilters) els.resetFilters.addEventListener("click", () => {
  els.searchInput.value = "";
  els.batchFilter.value = "";
  els.typeFilter.value = "";
  els.mainPushFilter.value = "";
  els.sortSelect.value = "default";
  applyFilters();
});

if (els.exportBtn) els.exportBtn.addEventListener("click", exportCSV);

if (els.lookupBtn) els.lookupBtn.addEventListener("click", renderLookupResult);
if (els.lookupInput) els.lookupInput.addEventListener("keydown", e => { if (e.key === "Enter") renderLookupResult(); });
if (els.lookupClear) els.lookupClear.addEventListener("click", () => {
  els.lookupInput.value = "";
  els.lookupResult.innerHTML = "";
});

if (els.addCalcRow) els.addCalcRow.addEventListener("click", () => {
  syncCalculatorStateFromDOM();
  calcRows.push({ id: nextCalcRowId++, rowIndex: "", qty: 1 });
  renderCalculatorRows();
});

if (els.addGiftRow) els.addGiftRow.addEventListener("click", () => {
  syncGiftStateFromDOM();
  giftCalcRows.push({ id: nextGiftRowId++, giftIndex: "", qty: 1 });
  renderGiftRows();
});

if (els.calculateBtn) els.calculateBtn.addEventListener("click", calculateLandedCost);

if (els.clearCalcBtn) els.clearCalcBtn.addEventListener("click", () => {
  calcRows = [{ id: nextCalcRowId++, rowIndex: "", qty: 1 }];
  giftCalcRows = [{ id: nextGiftRowId++, giftIndex: "", qty: 1 }];
  hideCalculationDetails();
  renderCalculatorRows();
  renderGiftRows();
});

if (els.calcRows) {
  els.calcRows.addEventListener("click", e => {
    const btn = e.target.closest(".calc-remove");
    if (!btn || btn.disabled) return;
    syncCalculatorStateFromDOM();
    const line = btn.closest(".calc-line");
    const id = parseInt(line.dataset.id, 10);
    calcRows = calcRows.filter(item => item.id !== id);
    hideCalculationDetails();
    renderCalculatorRows();
  });

  els.calcRows.addEventListener("input", e => {
    if (!e.target.matches(".calc-qty-input")) return;
    hideCalculationDetails();
  });

  els.calcRows.addEventListener("change", e => {
    if (!e.target.matches(".calc-product-select")) return;
    hideCalculationDetails();
  });
}

if (els.giftRows) {
  els.giftRows.addEventListener("click", e => {
    const btn = e.target.closest(".gift-remove");
    if (!btn || btn.disabled) return;
    syncGiftStateFromDOM();
    const line = btn.closest(".calc-line");
    const id = parseInt(line.dataset.id, 10);
    giftCalcRows = giftCalcRows.filter(item => item.id !== id);
    hideCalculationDetails();
    renderGiftRows();
  });

  els.giftRows.addEventListener("input", e => {
    if (!e.target.matches(".gift-qty-input")) return;
    hideCalculationDetails();
  });

  els.giftRows.addEventListener("change", e => {
    if (!e.target.matches(".gift-product-select")) return;
    hideCalculationDetails();
  });
}

els.currencyButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    setCurrency(btn.getAttribute("data-currency"));
  });
});

// 语言切换：和其他页面统一
document.addEventListener("langchange", () => {
  renderKPIs();
  renderTable();
  renderDataStatus();
});

// 回到顶部
const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
  const toggle = () => {
    if (window.scrollY > 300) backToTopBtn.classList.add("show");
    else backToTopBtn.classList.remove("show");
  };
  window.addEventListener("scroll", toggle);
  toggle();
  backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// ─── 初始化（内置数据，无需上传）──────────────────────────
function renderDataStatus() {
  if (!els.dataStatus) return;
  els.dataStatus.textContent = `${allRows.length} 条产品可选`;
  els.dataStatus.style.color = "#62B89A";
}

populateBatchFilter();
renderCalculatorRows();
renderGiftRows();
hideCalculationDetails();
applyFilters();
renderDataStatus();
updateCurrencyButtons();
