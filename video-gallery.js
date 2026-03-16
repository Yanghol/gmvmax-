const fileInput = document.getElementById("fileInput");
const fileMeta = document.getElementById("fileMeta");
const kpiGrid = document.getElementById("kpiGrid");
const dataStatus = document.getElementById("dataStatus");
const videoGrid = document.getElementById("videoGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

let rows = [];
let filtered = [];

const fields = {
  name: "Video name",
  link: "Video link",
  date: "Video post date",
  creator: "Creator username",
  gmv: "GMV",
  impressions: "Shoppable video impressions",
  likes: "Shoppable video likes",
  comments: "Shoppable video comments"
};

function toNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/,/g, "").replace(/%/g, "");
  const num = Number(cleaned);
  return Number.isNaN(num) ? 0 : num;
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
  return null;
}

function fmtNumber(value) {
  return value.toLocaleString("zh-CN");
}

function fmtCurrency(value) {
  return value.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function fmtDate(date) {
  if (!date) return "-";
  return date.toISOString().slice(0, 10);
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
    obj.__name = obj[fields.name] || "";
    obj.__link = obj[fields.link] || "";
    obj.__date = parseDate(obj[fields.date]);
    obj.__creator = obj[fields.creator] || "";
    obj.__gmv = toNumber(obj[fields.gmv]);
    obj.__impressions = toNumber(obj[fields.impressions]);
    obj.__likes = toNumber(obj[fields.likes]);
    obj.__comments = toNumber(obj[fields.comments]);
    return obj;
  });
}

function updateKpis(data) {
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

  kpiGrid.innerHTML = kpis.map(kpi => `
    <div class="kpi-card">
      <div class="kpi-title">${kpi.title}</div>
      <div class="kpi-value">${kpi.value}</div>
      <div class="kpi-note">${kpi.note}</div>
    </div>
  `).join("");

  dataStatus.textContent = `已导入 ${data.length} 条视频`;
  dataStatus.style.color = "#5bd0ff";
}

async function fetchThumbnail(url) {
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

function renderCards(data) {
  videoGrid.innerHTML = data.map((row, idx) => `
    <article class="video-card" data-index="${idx}">
      <div class="thumb" data-url="${row.__link}">
        <span>预览加载中</span>
      </div>
      <div class="video-body">
        <div class="video-title">${row.__name || "未命名视频"}</div>
        <div class="video-meta">@${row.__creator || "-"} • ${fmtDate(row.__date)}</div>
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

  setupThumbnailObserver();
}

function setupThumbnailObserver() {
  const thumbs = document.querySelectorAll(".thumb");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(async entry => {
      if (!entry.isIntersecting) return;
      const container = entry.target;
      observer.unobserve(container);
      const url = container.getAttribute("data-url");
      const thumb = await fetchThumbnail(url);
      if (!thumb) {
        container.innerHTML = "<span>暂无缩略图</span>";
        return;
      }
      container.innerHTML = `<img src="${thumb}" alt="视频缩略图" />`;
    });
  }, { rootMargin: "200px" });

  thumbs.forEach(thumb => observer.observe(thumb));
}

function applyFilterAndSort() {
  const keyword = searchInput.value.trim();
  filtered = rows.filter(r => {
    if (!keyword) return true;
    return (
      String(r.__name || "").includes(keyword) ||
      String(r.__creator || "").includes(keyword)
    );
  });

  const sortValue = sortSelect.value;
  const sortMap = {
    date_desc: (a, b) => (b.__date?.getTime() || 0) - (a.__date?.getTime() || 0),
    gmv_desc: (a, b) => b.__gmv - a.__gmv,
    likes_desc: (a, b) => b.__likes - a.__likes,
    comments_desc: (a, b) => b.__comments - a.__comments
  };
  filtered.sort(sortMap[sortValue]);

  renderCards(filtered);
}

fileInput.addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;
  fileMeta.textContent = `已选择：${file.name}`;

  const reader = new FileReader();
  reader.onload = e => {
    rows = parseSheet(e.target.result);
    updateKpis(rows);
    applyFilterAndSort();
  };
  reader.readAsArrayBuffer(file);
});

searchInput.addEventListener("input", applyFilterAndSort);
sortSelect.addEventListener("change", applyFilterAndSort);

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
