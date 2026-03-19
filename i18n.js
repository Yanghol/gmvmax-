(() => {
  const translations = {
    zh: {
      "common.brand": "CusCus工作台",
      "common.nav.home": "导航页",
      "common.nav.gmv": "GMV MAX分析",
      "common.nav.video": "视频看板",
      "common.lang.zh": "中文",
      "common.lang.en": "English",

      "index.title": "CusCus工作台",
      "index.eyebrow": "选择模块",
      "index.h1": "CusCus导航页",
      "index.sub": "请选择要进入的功能模块。",
      "index.card.gmv.title": "CusCus GMV MAX分析看台",
      "index.card.gmv.desc": "导入 GMV MAX 报表，生成关键指标、趋势、聚合与优化建议。",
      "index.card.video.title": "CusCus视频看板",
      "index.card.video.desc": "导入 Video List 表格，自动解析视频链接与缩略图，便于互动。",
      "index.footer": "CusCus工作台 • 导航页",

      "gmv.title": "CusCus GMV MAX分析看台",
      "gmv.eyebrow": "GMV MAX • 广告数据分析与优化建议",
      "gmv.h1": "CusCus GMV MAX分析看台",
      "gmv.sub": "上传 GMV MAX 后台导出的创意数据报表，自动生成关键指标、趋势洞察与可执行优化建议。",
      "gmv.upload.title": "导入报表",
      "gmv.upload.button": "选择 Excel 文件",
      "gmv.upload.hint": "支持 GMV MAX 导出的 Excel 报表",
      "gmv.upload.empty": "尚未导入文件",
      "gmv.section.kpi": "关键指标",
      "gmv.section.recent": "近七天新增GMV视频",
      "gmv.section.inflight": "在投视频播放数据",
      "gmv.inflight.pill": "仅统计状态为“投放中”的视频",
      "gmv.section.trend": "趋势与结构",
      "gmv.trend.label": "趋势维度",
      "gmv.trend.day": "按天",
      "gmv.trend.week": "按周",
      "gmv.trend.month": "按月",
      "gmv.trend.export": "导出清洗后的 CSV",
      "gmv.chart.roi": "ROI / 成本 / 收入趋势",
      "gmv.chart.ctr": "点击率与转化率",
      "gmv.chart.watch": "播放深度分布",
      "gmv.section.aggregate": "聚合分析",
      "gmv.aggregate.pill": "按账号 / 创意类型 / 视频来源",
      "gmv.aggregate.account": "按 TikTok 账号",
      "gmv.aggregate.type": "按创意作品类型",
      "gmv.aggregate.source": "按视频来源",
      "gmv.section.alert": "预警与优化建议",
      "gmv.alert.pill": "自定义阈值 + 智能建议",
      "gmv.alert.roi": "ROI 预警阈值",
      "gmv.alert.ctr": "CTR 预警阈值",
      "gmv.alert.cvr": "CVR 预警阈值",
      "gmv.alert.apply": "应用阈值",
      "gmv.section.detail": "视频明细",
      "gmv.search.placeholder": "搜索视频 ID / 标题 / 账号",
      "gmv.sort.roi": "ROI 从高到低",
      "gmv.sort.cost": "成本 从高到低",
      "gmv.sort.revenue": "收入 从高到低",
      "gmv.sort.orders": "订单数 从高到低",
      "gmv.sort.ctr": "点击率 从高到低",
      "gmv.help.title": "GMV MAX 是什么？",
      "gmv.help.body": "GMV MAX 是 TikTok Shop 的自动化投放模式，系统会基于你的目标（GMV/ROI）自动选择创意、投放位置与优化策略。你需要关注的是：高 ROI 素材、低成本获客、高完播率脚本与高转化链路。",
      "gmv.footer": "CusCus GMV MAX分析看台",
      "fx.title": "汇率换算",
      "fx.cny": "人民币 (CNY)",
      "fx.idr": "印尼盾 (IDR)",
      "fx.placeholder": "输入金额",
      "fx.status": "实时汇率",
      "fx.currency": "货币",
      "fx.refresh": "刷新",
      "fx.updated": "更新于",
      "fx.cached": "缓存于",
      "fx.failed": "汇率获取失败",

      "video.title": "CusCus视频看板",
      "video.eyebrow": "视频互动 • 链接与缩略图预览",
      "video.h1": "CusCus视频看板",
      "video.sub": "上传 Video List 表格，自动解析视频名称、链接、达人账号与缩略图预览。",
      "video.upload.title": "导入视频列表",
      "video.upload.button": "选择 Excel 文件",
      "video.upload.hint": "支持 Video List 导出表",
      "video.upload.empty": "尚未导入文件",
      "video.section.overview": "概览",
      "video.section.list": "视频列表",
      "video.search.placeholder": "搜索视频名 / 账号",
      "video.sort.date": "发布时间 从新到旧",
      "video.sort.gmv": "GMV 从高到低",
      "video.sort.likes": "点赞 从高到低",
      "video.sort.comments": "评论 从高到低",
      "video.page.size20": "每页 20",
      "video.page.size50": "每页 50",
      "video.page.size100": "每页 100",
      "video.footer": "CusCus视频看板",

      "status.wait": "等待导入",
      "status.uploaded": "已导入 {count} 条视频数据",
      "status.uploaded_video": "已导入 {count} 条视频",
      "status.no_date": "未找到可用日期",

      "kpi.total_cost": "总成本",
      "kpi.total_revenue": "总收入",
      "kpi.ad_impressions": "广告曝光度",
      "kpi.roi": "整体 ROI",
      "kpi.orders": "总订单数",
      "kpi.cpa": "平均下单成本",
      "kpi.ctr": "整体点击率",
      "kpi.cvr": "整体转化率",
      "kpi.avg_watch": "平均完播率",
      "kpi.video_count": "视频数量",
      "kpi.total_gmv": "总 GMV",
      "kpi.total_impressions": "广告曝光度",
      "kpi.total_likes": "总点赞",
      "kpi.total_comments": "总评论",

      "note.total_cost": "GMV MAX 投放成本总和",
      "note.total_revenue": "GMV MAX 归因收入",
      "note.ad_impressions": "广告曝光汇总",
      "note.roi": "总收入 ÷ 总成本",
      "note.orders": "SKU 订单汇总",
      "note.cpa": "成本 ÷ 订单",
      "note.ctr": "点击 ÷ 曝光",
      "note.cvr": "订单 ÷ 点击",
      "note.avg_watch": "平均观看深度",
      "note.video_count": "导入的有效视频数",
      "note.total_gmv": "视频列表 GMV 汇总",
      "note.total_impressions": "Shoppable impressions",
      "note.total_likes": "Shoppable likes",
      "note.total_comments": "Shoppable comments",

      "inflight.impressions": "投放中曝光",
      "inflight.cost": "投放中成本",
      "inflight.revenue": "投放中收入",
      "inflight.roi": "投放中 ROI",
      "inflight.ctr": "投放中 CTR",
      "inflight.cvr": "投放中 CVR",
      "inflight.watch2": "2 秒播放率",
      "inflight.watch6": "6 秒播放率",
      "inflight.watch25": "25% 播放率",
      "inflight.watch50": "50% 播放率",
      "inflight.watch75": "75% 播放率",
      "inflight.watch100": "完播率",
      "inflight.note": "投放中素材",

      "label.gmv": "GMV",
      "label.cost": "成本",
      "label.roi": "ROI",
      "label.orders": "订单",
      "label.ad_impressions": "广告曝光度",
      "label.ctr": "CTR",
      "label.impressions": "曝光",
      "label.likes": "点赞",
      "label.comments": "评论",

      "action.open": "打开视频",
      "action.copy": "复制链接",
      "action.copied": "已复制",
      "action.copy_fail": "复制失败",
      "action.no_link": "无链接",

      "thumb.loading": "预览加载中",
      "thumb.empty": "暂无缩略图",

      "pagination.prev": "上一页",
      "pagination.next": "下一页",
      "pagination.total": "共 {count} 页",
      "pagination.jump": "跳转",
      "pagination.page": "页码",

      "recent.meta": "{start} - {end} • {count} 条",

      "alert.summary": "ROI 低于阈值 {roi} 条 | CTR 低于阈值 {ctr} 条 | CVR 低于阈值 {cvr} 条",
      "alert.none": "请输入至少一个阈值并点击“应用阈值”",

      "rec.high_roi": "高 ROI 素材（前 25%）建议加预算",
      "rec.high_cost_no_order": "高成本无订单素材建议暂停",
      "rec.high_impr_low_ctr": "高曝光低点击需优化封面/开头",
      "rec.high_ctr_low_cvr": "高点击低转化需优化价格或落地页",
      "rec.low_watch": "低完播率脚本需强化节奏",
      "rec.none": "暂无明显高 ROI 素材",
      "rec.none_cost": "未发现高成本无订单素材",
      "rec.none_ctr": "未发现高曝光低点击素材",
      "rec.none_cvr": "未发现高点击低转化素材",
      "rec.none_watch": "完播率整体较好",

      "lib.xlsx": "未加载表格解析库，请检查网络或稍后重试。",
      "lib.chart": "图表库加载失败，趋势图暂不可用。"
    },
    en: {
      "common.brand": "CusCus Workspace",
      "common.nav.home": "Home",
      "common.nav.gmv": "GMV MAX Analytics",
      "common.nav.video": "Video Hub",
      "common.lang.zh": "中文",
      "common.lang.en": "English",

      "index.title": "CusCus Workspace",
      "index.eyebrow": "Choose a module",
      "index.h1": "CusCus Navigation",
      "index.sub": "Select a module to enter.",
      "index.card.gmv.title": "CusCus GMV MAX Dashboard",
      "index.card.gmv.desc": "Import GMV MAX reports to get KPIs, trends, aggregates, and recommendations.",
      "index.card.video.title": "CusCus Video Hub",
      "index.card.video.desc": "Import Video List to preview links and thumbnails for collaboration.",
      "index.footer": "CusCus Workspace • Home",

      "gmv.title": "CusCus GMV MAX Dashboard",
      "gmv.eyebrow": "GMV MAX • Ad analytics & recommendations",
      "gmv.h1": "CusCus GMV MAX Dashboard",
      "gmv.sub": "Upload GMV MAX export to generate KPIs, trends, and actionable insights.",
      "gmv.upload.title": "Import Report",
      "gmv.upload.button": "Choose Excel",
      "gmv.upload.hint": "Supports GMV MAX export",
      "gmv.upload.empty": "No file selected",
      "gmv.section.kpi": "Key Metrics",
      "gmv.section.recent": "New GMV Videos (Last 7 Days)",
      "gmv.section.inflight": "In-flight Video Stats",
      "gmv.inflight.pill": "Only videos with status 'Active'",
      "gmv.section.trend": "Trends & Structure",
      "gmv.trend.label": "Granularity",
      "gmv.trend.day": "Daily",
      "gmv.trend.week": "Weekly",
      "gmv.trend.month": "Monthly",
      "gmv.trend.export": "Export Clean CSV",
      "gmv.chart.roi": "ROI / Cost / Revenue Trend",
      "gmv.chart.ctr": "CTR & CVR",
      "gmv.chart.watch": "Watch Depth",
      "gmv.section.aggregate": "Aggregate",
      "gmv.aggregate.pill": "By account / creative / source",
      "gmv.aggregate.account": "By TikTok account",
      "gmv.aggregate.type": "By creative type",
      "gmv.aggregate.source": "By video source",
      "gmv.section.alert": "Alerts & Recommendations",
      "gmv.alert.pill": "Custom thresholds + smart tips",
      "gmv.alert.roi": "ROI threshold",
      "gmv.alert.ctr": "CTR threshold",
      "gmv.alert.cvr": "CVR threshold",
      "gmv.alert.apply": "Apply",
      "gmv.section.detail": "Video Details",
      "gmv.search.placeholder": "Search video ID / title / account",
      "gmv.sort.roi": "ROI: High to Low",
      "gmv.sort.cost": "Cost: High to Low",
      "gmv.sort.revenue": "Revenue: High to Low",
      "gmv.sort.orders": "Orders: High to Low",
      "gmv.sort.ctr": "CTR: High to Low",
      "gmv.help.title": "What is GMV MAX?",
      "gmv.help.body": "GMV MAX is TikTok Shop’s automated ad mode. It optimizes creatives, placements, and delivery toward GMV/ROI. Focus on high-ROI assets, efficient acquisition, strong completion rates, and conversion flow.",
      "gmv.footer": "CusCus GMV MAX Dashboard",

      "video.title": "CusCus Video Hub",
      "video.eyebrow": "Video collaboration • Links & thumbnails",
      "video.h1": "CusCus Video Hub",
      "video.sub": "Upload Video List to parse titles, links, creators, and thumbnails.",
      "video.upload.title": "Import Video List",
      "video.upload.button": "Choose Excel",
      "video.upload.hint": "Supports Video List export",
      "video.upload.empty": "No file selected",
      "video.section.overview": "Overview",
      "video.section.list": "Video List",
      "video.search.placeholder": "Search title / creator",
      "video.sort.date": "Date: New to Old",
      "video.sort.gmv": "GMV: High to Low",
      "video.sort.likes": "Likes: High to Low",
      "video.sort.comments": "Comments: High to Low",
      "video.page.size20": "20 per page",
      "video.page.size50": "50 per page",
      "video.page.size100": "100 per page",
      "video.footer": "CusCus Video Hub",

      "fx.title": "FX Converter",
      "fx.cny": "Chinese Yuan (CNY)",
      "fx.idr": "Indonesian Rupiah (IDR)",
      "fx.placeholder": "Enter amount",
      "fx.status": "Live rate",
      "fx.currency": "Currency",
      "fx.refresh": "Refresh",
      "fx.updated": "Updated",
      "fx.cached": "Cached",
      "fx.failed": "Rate unavailable",

      "status.wait": "Waiting for upload",
      "status.uploaded": "Imported {count} videos",
      "status.uploaded_video": "Imported {count} videos",
      "status.no_date": "No valid date found",

      "kpi.total_cost": "Total Cost",
      "kpi.total_revenue": "Total Revenue",
      "kpi.ad_impressions": "Ad Impressions",
      "kpi.roi": "Overall ROI",
      "kpi.orders": "Total Orders",
      "kpi.cpa": "Avg Cost per Order",
      "kpi.ctr": "Overall CTR",
      "kpi.cvr": "Overall CVR",
      "kpi.avg_watch": "Avg Completion",
      "kpi.video_count": "Videos",
      "kpi.total_gmv": "Total GMV",
      "kpi.total_impressions": "Ad Impressions",
      "kpi.total_likes": "Total Likes",
      "kpi.total_comments": "Total Comments",

      "note.total_cost": "Total ad spend",
      "note.total_revenue": "Attributed revenue",
      "note.ad_impressions": "Total ad impressions",
      "note.roi": "Revenue ÷ Cost",
      "note.orders": "Total SKU orders",
      "note.cpa": "Cost ÷ Orders",
      "note.ctr": "Clicks ÷ Impressions",
      "note.cvr": "Orders ÷ Clicks",
      "note.avg_watch": "Avg watch depth",
      "note.video_count": "Imported videos",
      "note.total_gmv": "Total GMV",
      "note.total_impressions": "Shoppable impressions",
      "note.total_likes": "Shoppable likes",
      "note.total_comments": "Shoppable comments",

      "inflight.impressions": "Active Impressions",
      "inflight.cost": "Active Cost",
      "inflight.revenue": "Active Revenue",
      "inflight.roi": "Active ROI",
      "inflight.ctr": "Active CTR",
      "inflight.cvr": "Active CVR",
      "inflight.watch2": "2s Watch Rate",
      "inflight.watch6": "6s Watch Rate",
      "inflight.watch25": "25% Watch",
      "inflight.watch50": "50% Watch",
      "inflight.watch75": "75% Watch",
      "inflight.watch100": "Completion",
      "inflight.note": "Active videos",

      "label.gmv": "GMV",
      "label.cost": "Cost",
      "label.roi": "ROI",
      "label.orders": "Orders",
      "label.ad_impressions": "Ad Impressions",
      "label.ctr": "CTR",
      "label.impressions": "Impressions",
      "label.likes": "Likes",
      "label.comments": "Comments",

      "action.open": "Open Video",
      "action.copy": "Copy Link",
      "action.copied": "Copied",
      "action.copy_fail": "Copy Failed",
      "action.no_link": "No Link",

      "thumb.loading": "Loading preview",
      "thumb.empty": "No thumbnail",

      "pagination.prev": "Prev",
      "pagination.next": "Next",
      "pagination.total": "{count} pages",
      "pagination.jump": "Go",
      "pagination.page": "Page",

      "recent.meta": "{start} - {end} • {count} items",

      "alert.summary": "ROI below: {roi} | CTR below: {ctr} | CVR below: {cvr}",
      "alert.none": "Enter at least one threshold and click Apply",

      "rec.high_roi": "Boost high-ROI assets (top 25%)",
      "rec.high_cost_no_order": "Pause high-cost no-order assets",
      "rec.high_impr_low_ctr": "High impressions, low CTR: optimize hook",
      "rec.high_ctr_low_cvr": "High CTR, low CVR: optimize offer/landing",
      "rec.low_watch": "Low completion: improve pacing",
      "rec.none": "No standout high-ROI assets",
      "rec.none_cost": "No high-cost no-order assets",
      "rec.none_ctr": "No high-impression low-CTR assets",
      "rec.none_cvr": "No high-CTR low-CVR assets",
      "rec.none_watch": "Completion rate looks healthy",

      "lib.xlsx": "Spreadsheet parser not loaded. Check your connection.",
      "lib.chart": "Chart library failed to load. Trend chart unavailable."
    }
  };

  function t(key, vars) {
    const lang = localStorage.getItem("lang") || "zh";
    const dict = translations[lang] || translations.zh;
    let text = dict[key] || key;
    if (vars) {
      Object.keys(vars).forEach(k => {
        text = text.replace(new RegExp(`\\{${k}\\}`, "g"), vars[k]);
      });
    }
    return text;
  }

  function applyI18n() {
    const lang = localStorage.getItem("lang") || "zh";
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    document.body.classList.toggle("lang-en", lang === "en");

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key) el.setAttribute("placeholder", t(key));
    });

    document.querySelectorAll("[data-i18n-title]").forEach(el => {
      const key = el.getAttribute("data-i18n-title");
      if (key) el.setAttribute("title", t(key));
    });

    const titleEl = document.querySelector("title[data-i18n]");
    if (titleEl) titleEl.textContent = t(titleEl.getAttribute("data-i18n"));

    document.dispatchEvent(new CustomEvent("langchange"));
  }

  function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    applyI18n();
  }

  document.addEventListener("click", event => {
    const btn = event.target.closest("[data-lang]");
    if (!btn) return;
    setLanguage(btn.getAttribute("data-lang"));
  });

  window.t = t;
  window.setLanguage = setLanguage;
  applyI18n();
})();
