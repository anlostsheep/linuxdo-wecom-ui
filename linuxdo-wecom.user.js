// ==UserScript==
// @name         Linux DO · 企业微信智能文档外观
// @namespace    https://linux.do/
// @version      1.3.0
// @description  将 Linux DO 深度伪装为企业微信智能文档/团队知识库风格。支持浅色/深色模式，Callout 提示卡片与文档排版。
// @author       lostsheep
// @match        https://linux.do/*
// @icon         https://linux.do/favicon.ico
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";
  const CSS = "html.wecom-doc-theme {\n  color-scheme: light !important;\n  --wecom-bg: #ffffff;\n  --wecom-sidebar: #f7f8fa;\n  --wecom-line: #e4e7ed;\n  --wecom-text: #1f2329;\n  --wecom-text-2: #646a73;\n  --wecom-text-3: #8f959e;\n  --wecom-search: #f2f3f5;\n  --wecom-hover: #ebeef5;\n  --wecom-active: #e8f3ff;\n  --wecom-link: #1f7eff;\n  --wecom-link-hover: #006fe6;\n  --wecom-doc: #4b8cff;\n  --wecom-callout-bg: #f0f6ff;\n  --wecom-callout-border: rgba(31, 126, 255, 0.2);\n  --wecom-header-h: 56px;\n  --primary: #1f2329 !important;\n  --secondary: #ffffff !important;\n  --header_background: #ffffff !important;\n  --header_primary: #1f2329 !important;\n  --primary-low: #f7f8fa !important;\n  --primary-very-low: #ffffff !important;\n  --d-hover: #ebeef5 !important;\n  --tertiary: #1f7eff !important;\n}\n\nhtml.wecom-doc-theme.wecom-dark {\n  color-scheme: dark !important;\n  --wecom-bg: #191b1f;\n  --wecom-sidebar: #1e2025;\n  --wecom-line: #2d3038;\n  --wecom-text: #e6e8eb;\n  --wecom-text-2: #9a9ea6;\n  --wecom-text-3: #737882;\n  --wecom-search: #252830;\n  --wecom-hover: #292d36;\n  --wecom-active: #1a2b45;\n  --wecom-link: #388bff;\n  --wecom-link-hover: #549dff;\n  --wecom-doc: #4b8cff;\n  --wecom-callout-bg: #1c2538;\n  --wecom-callout-border: rgba(56, 139, 255, 0.25);\n  --primary: #e6e8eb !important;\n  --secondary: #191b1f !important;\n  --header_background: #191b1f !important;\n  --header_primary: #e6e8eb !important;\n  --primary-low: #1e2025 !important;\n  --primary-very-low: #141518 !important;\n  --d-hover: #292d36 !important;\n  --tertiary: #388bff !important;\n}\n\nhtml.wecom-doc-theme,\nhtml.wecom-doc-theme body {\n  background: var(--wecom-bg) !important;\n  color: var(--wecom-text) !important;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\",\n    \"Hiragino Sans GB\", \"Microsoft YaHei\", Arial, sans-serif !important;\n  -webkit-font-smoothing: antialiased;\n}\n\nhtml.wecom-doc-theme a {\n  color: inherit;\n  text-decoration: none;\n}\n\nhtml.wecom-doc-theme .cooked a {\n  color: var(--wecom-link) !important;\n  text-decoration: none;\n}\n\nhtml.wecom-doc-theme .cooked a:hover {\n  text-decoration: underline;\n}\n\n/* 顶栏 (Header) - 智能文档质感 */\nhtml.wecom-doc-theme .d-header-wrap,\nhtml.wecom-doc-theme body .d-header {\n  height: var(--wecom-header-h) !important;\n  background: var(--wecom-bg) !important;\n  border-bottom: 1px solid var(--wecom-line) !important;\n  box-shadow: none !important;\n}\n\nhtml.wecom-doc-theme .d-header .title img,\nhtml.wecom-doc-theme .d-header .title picture,\nhtml.wecom-doc-theme .d-header .title .logo-big,\nhtml.wecom-doc-theme .d-header .title .logo-small {\n  display: none !important;\n}\n\nhtml.wecom-doc-theme .wecom-brand {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 15px;\n  font-weight: 600;\n  color: var(--wecom-text);\n  text-decoration: none;\n  letter-spacing: -0.2px;\n}\n\nhtml.wecom-doc-theme .wecom-app-icon {\n  width: 28px;\n  height: 28px;\n  flex: none;\n  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08));\n}\n\nhtml.wecom-doc-theme .wecom-topic-context {\n  margin-left: 14px;\n  display: inline-flex;\n  align-items: center;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--wecom-text-2);\n  font-size: 13px;\n  max-width: 50vw;\n}\n\n/* 侧边栏 (Sidebar) - 智能文档树形目录风格 */\nhtml.wecom-doc-theme .sidebar-wrapper {\n  background: var(--wecom-sidebar) !important;\n  border-right: 1px solid var(--wecom-line) !important;\n  box-shadow: none !important;\n}\n\nhtml.wecom-doc-theme .sidebar-section-header-text {\n  font-size: 12px !important;\n  font-weight: 600 !important;\n  color: var(--wecom-text-3) !important;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n\nhtml.wecom-doc-theme .sidebar-section-link,\nhtml.wecom-doc-theme .sidebar-section-link-content-text {\n  color: var(--wecom-text) !important;\n  font-size: 13.5px !important;\n  font-weight: 400;\n}\n\nhtml.wecom-doc-theme .sidebar-section-link-wrapper.is-active,\nhtml.wecom-doc-theme .sidebar-section-link.active {\n  background: var(--wecom-active) !important;\n  color: var(--wecom-link) !important;\n  border-radius: 6px;\n  font-weight: 500 !important;\n}\n\nhtml.wecom-doc-theme .sidebar-section-link:hover {\n  background: var(--wecom-hover);\n  border-radius: 6px;\n}\n\n/* 主内容区与列表 (Topic List) */\nhtml.wecom-doc-theme #main-outlet {\n  background: var(--wecom-bg) !important;\n}\n\nhtml.wecom-doc-theme .topic-list-header th {\n  color: var(--wecom-text-3) !important;\n  border-bottom: 1px solid var(--wecom-line) !important;\n  font-weight: 500;\n  font-size: 13px;\n  padding: 10px 8px;\n}\n\nhtml.wecom-doc-theme .topic-list-item {\n  border-bottom: 1px solid var(--wecom-line) !important;\n  transition: background 120ms ease;\n}\n\nhtml.wecom-doc-theme .topic-list-item:hover {\n  background: var(--wecom-hover) !important;\n}\n\nhtml.wecom-doc-theme .wecom-doc-icon {\n  width: 18px;\n  height: 18px;\n  border-radius: 4px;\n  flex: none;\n  background: var(--wecom-doc);\n  position: relative;\n  display: inline-block;\n  vertical-align: -3px;\n  margin-right: 6px;\n}\n\nhtml.wecom-doc-theme .wecom-doc-icon::before {\n  content: \"\";\n  position: absolute;\n  left: 3.5px;\n  right: 3.5px;\n  top: 4px;\n  bottom: 4px;\n  background:\n    linear-gradient(#fff, #fff) 0 0 / 100% 2px no-repeat,\n    linear-gradient(#fff, #fff) 0 3.5px / 100% 2px no-repeat,\n    linear-gradient(#fff, #fff) 0 7px / 65% 2px no-repeat;\n}\n\n/* 按钮样式 - 智能文档标准按钮 */\nhtml.wecom-doc-theme .btn-primary,\nhtml.wecom-doc-theme .wecom-create-topic {\n  background: var(--wecom-link) !important;\n  color: #fff !important;\n  border: none !important;\n  border-radius: 6px !important;\n  font-weight: 500 !important;\n  transition: background 120ms ease;\n}\n\nhtml.wecom-doc-theme .btn-primary:hover,\nhtml.wecom-doc-theme .wecom-create-topic:hover {\n  background: var(--wecom-link-hover) !important;\n}\n\nhtml.wecom-doc-theme .btn-default {\n  border-radius: 6px !important;\n  border: 1px solid var(--wecom-line) !important;\n  background: var(--wecom-bg) !important;\n  color: var(--wecom-text) !important;\n}\n\n/* 话题详情页 (Topic Detail) - 智能文档排版 */\nhtml.wecom-doc-theme #topic-title {\n  margin-bottom: 24px !important;\n  padding-bottom: 14px !important;\n  border-bottom: 1px solid var(--wecom-line) !important;\n}\n\nhtml.wecom-doc-theme #topic-title h1,\nhtml.wecom-doc-theme #topic-title .fancy-title {\n  font-size: 26px !important;\n  font-weight: 700 !important;\n  line-height: 1.35 !important;\n  color: var(--wecom-text) !important;\n  letter-spacing: -0.3px;\n  margin-bottom: 10px !important;\n}\n\nhtml.wecom-doc-theme #topic-title .badge-wrapper.bullet,\nhtml.wecom-doc-theme #topic-title .badge-wrapper.bar {\n  display: inline-flex !important;\n  align-items: center !important;\n  padding: 2px 8px !important;\n  border-radius: 4px !important;\n  background: var(--wecom-search) !important;\n  font-size: 12px !important;\n  margin-right: 6px !important;\n}\n\nhtml.wecom-doc-theme #topic-title .badge-category__name,\nhtml.wecom-doc-theme #topic-title .badge-category-bg {\n  color: var(--wecom-text-2) !important;\n  font-weight: 500 !important;\n}\n\nhtml.wecom-doc-theme .topic-body {\n  border-top: 1px solid var(--wecom-line) !important;\n}\n\nhtml.wecom-doc-theme .topic-post:first-child .topic-body {\n  border-top: none !important;\n}\n\n/* 楼层头部元信息轻量化 (Document Collaborator Header) */\nhtml.wecom-doc-theme .topic-meta-data {\n  padding-bottom: 6px !important;\n}\n\nhtml.wecom-doc-theme .names span.first.username {\n  font-weight: 600 !important;\n  color: var(--wecom-text) !important;\n  font-size: 13.5px !important;\n}\n\nhtml.wecom-doc-theme .post-info.post-date {\n  color: var(--wecom-text-3) !important;\n  font-size: 12px !important;\n}\n\n/* 正文排版 (Smart Doc Cooked Content) */\nhtml.wecom-doc-theme .cooked {\n  font-size: 15px !important;\n  line-height: 1.75 !important;\n  color: var(--wecom-text) !important;\n}\n\nhtml.wecom-doc-theme .cooked h1 {\n  font-size: 22px !important;\n  font-weight: 700 !important;\n  margin: 26px 0 14px !important;\n  color: var(--wecom-text) !important;\n}\n\nhtml.wecom-doc-theme .cooked h2 {\n  font-size: 18.5px !important;\n  font-weight: 600 !important;\n  margin: 22px 0 12px !important;\n  color: var(--wecom-text) !important;\n}\n\nhtml.wecom-doc-theme .cooked h3 {\n  font-size: 16.5px !important;\n  font-weight: 600 !important;\n  margin: 18px 0 10px !important;\n  color: var(--wecom-text) !important;\n}\n\nhtml.wecom-doc-theme .cooked ul,\nhtml.wecom-doc-theme .cooked ol {\n  padding-left: 24px !important;\n  margin: 12px 0 !important;\n}\n\nhtml.wecom-doc-theme .cooked li {\n  margin-bottom: 6px !important;\n  line-height: 1.7 !important;\n}\n\n/* 智能文档 Callout 提示卡片样式 */\nhtml.wecom-doc-theme .cooked blockquote,\nhtml.wecom-doc-theme aside.quote {\n  margin: 16px 0 !important;\n  padding: 14px 18px !important;\n  border: 1px solid var(--wecom-callout-border) !important;\n  background: var(--wecom-callout-bg) !important;\n  border-radius: 8px !important;\n  color: var(--wecom-text) !important;\n  position: relative;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);\n}\n\nhtml.wecom-doc-theme .cooked blockquote p:last-child {\n  margin-bottom: 0 !important;\n}\n\n/* 代码块与行内代码 */\nhtml.wecom-doc-theme .cooked code {\n  background: var(--wecom-search) !important;\n  color: var(--wecom-text) !important;\n  padding: 2px 6px !important;\n  border-radius: 4px !important;\n  font-size: 0.9em !important;\n}\n\nhtml.wecom-doc-theme .cooked pre code {\n  padding: 14px 16px !important;\n  border-radius: 8px !important;\n  border: 1px solid var(--wecom-line) !important;\n  display: block;\n  line-height: 1.55 !important;\n}\n\n/* 表格组件 */\nhtml.wecom-doc-theme .cooked table {\n  width: 100% !important;\n  border-collapse: collapse !important;\n  margin: 16px 0 !important;\n  border: 1px solid var(--wecom-line) !important;\n  border-radius: 6px !important;\n}\n\nhtml.wecom-doc-theme .cooked table th,\nhtml.wecom-doc-theme .cooked table td {\n  border: 1px solid var(--wecom-line) !important;\n  padding: 10px 14px !important;\n}\n\nhtml.wecom-doc-theme .cooked table th {\n  background: var(--wecom-sidebar) !important;\n  font-weight: 600 !important;\n}\n\n/* 顶栏图标与搜索 */\nhtml.wecom-doc-theme .d-header .search-input {\n  border-radius: 6px !important;\n  background: var(--wecom-search) !important;\n  border: 1px solid var(--wecom-line) !important;\n  color: var(--wecom-text) !important;\n}\n\n/* 时间线与底部控制 */\nhtml.wecom-doc-theme .timeline-container .topic-timeline .timeline-handle {\n  background-color: var(--wecom-link) !important;\n}\n\nhtml.wecom-doc-theme #topic-footer-buttons {\n  border-top: 1px solid var(--wecom-line) !important;\n  padding-top: 16px !important;\n}\n\n";
const THEME_CLASS = "wecom-doc-theme";
const HOME_CLASS = "wecom-doc-home";
const TOPIC_CLASS = "wecom-doc-topic";
const DARK_CLASS = "wecom-dark";
const STYLE_ID = "linuxdo-wecom-theme";
const FAVICON_ID = "wecom-favicon";

function isTopicPath(pathname) {
  return /^\/t\//.test(pathname);
}

function isDarkFromScheme(media, prefersDark) {
  if (media == null) return false;
  if (media === "all") return true;
  if (media === "none") return false;
  return Boolean(prefersDark);
}

function readDarkSchemeMedia(document) {
  const link = document.querySelector("link.dark-scheme");
  return link ? link.media : null;
}

function applyColorMode(html, dark) {
  html.classList.toggle(DARK_CLASS, Boolean(dark));
}

function applyPageMode(html, body, pathname) {
  const topic = isTopicPath(pathname);
  html.classList.add(THEME_CLASS);
  html.classList.toggle(HOME_CLASS, !topic);
  html.classList.toggle(TOPIC_CLASS, topic);
  if (body) {
    body.classList.toggle(HOME_CLASS, !topic);
    body.classList.toggle(TOPIC_CLASS, topic);
  }
  return topic ? "topic" : "home";
}

function topicTitleFromDocumentTitle(title) {
  return String(title || "")
    .replace(/\s*[-–]\s*Linux DO\s*$/, "")
    .trim();
}

function topicContextText(category, title) {
  const cat = (category && category.trim()) || "知识库";
  return `知识库 › ${cat} › ${title}`;
}

function runStep(fn) {
  try {
    fn();
  } catch {
    /* keep later steps running */
  }
}

const WECOM_BRAND_SVG = `<svg class="wecom-app-icon" viewBox="0 0 36 36" aria-hidden="true" width="28" height="28">
  <rect x="0.5" y="0.5" width="35" height="35" rx="8" fill="#ffffff"/>
  <g transform="translate(5.0, 4.8) scale(0.90)">
    <path d="M13.053 2.7c7.033 0 12.754 4.954 12.754 11.084 0 .224-.01.445-.021.667l-.01.136-.102-.09a2.554 2.554 0 0 0-2.532-.504l-.091.03v-.451c-.16-4.558-4.573-8.24-10-8.24-1.13 0-2.217.16-3.232.454l-.43.133C5.673 7.164 3.05 10.241 3.05 13.821c0 2.52 1.3 4.788 3.365 6.348l.094.081a.9.9 0 0 1 .263.667l-.012.124-.351 1.996a.172.172 0 0 0 .254.178l2.293-1.323.085-.042c.2-.088.424-.1.633-.037l.4.115a11.53 11.53 0 0 0 2.98.385 11.59 11.59 0 0 0 3.437-.518l.073-.021.012.076a2.57 2.57 0 0 0 1.63 1.956l.166.064-.167.063a14.35 14.35 0 0 1-5.151.942 14.48 14.48 0 0 1-3.792-.5l-3.79 1.848a.96.96 0 0 1-1.374-.963l.345-3.292C1.9 19.938.3 17.025.3 13.788.3 7.653 6.018 2.7 13.054 2.7z" fill="#0082EF"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M25.29 15.105c.315.315.493.714.533 1.13h.003a4.591 4.591 0 0 0 1.42 2.798l.024.024a.467.467 0 0 1-.009.648.459.459 0 0 1-.648.01l-.024-.025c-.03-.036-.064-.07-.094-.103a4.629 4.629 0 0 0-2.686-1.32 1.877 1.877 0 0 1-1.148-.533 1.853 1.853 0 0 1 0-2.626 1.853 1.853 0 0 1 2.626 0l.003-.003z" fill="#2DBC00"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M30.275 22.61a1.836 1.836 0 0 1-1.13.533h-.003a4.624 4.624 0 0 0-2.701 1.326 1.291 1.291 0 0 0-.091.097l-.025.024a.467.467 0 0 1-.648-.009.459.459 0 0 1-.009-.648l.024-.024c.037-.03.07-.063.103-.094a4.63 4.63 0 0 0 1.32-2.686 1.877 1.877 0 0 1 .533-1.148 1.854 1.854 0 0 1 2.627 0 1.854 1.854 0 0 1 0 2.626v.003z" fill="#0082EF"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M22.773 27.595a1.836 1.836 0 0 1-.533-1.13h-.003a4.592 4.592 0 0 0-1.324-2.707.994.994 0 0 0-.097-.091l-.024-.024a.467.467 0 0 1 .01-.649.459.459 0 0 1 .647-.009l.025.025c.03.036.063.07.093.102a4.628 4.628 0 0 0 2.687 1.321 1.877 1.877 0 0 1 1.148.533 1.853 1.853 0 0 1 0 2.626 1.854 1.854 0 0 1-2.626 0l-.003.003z" fill="#FB6500"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.785 20.093a1.836 1.836 0 0 1 1.13-.533h.002a4.625 4.625 0 0 0 2.702-1.327c.033-.033.067-.066.09-.097l.025-.024a.467.467 0 0 1 .648.01c.182.181.185.46.01.647l-.025.025c-.036.03-.07.063-.103.093a4.63 4.63 0 0 0-1.32 2.687 1.877 1.877 0 0 1-.533 1.148 1.854 1.854 0 0 1-2.626 0 1.853 1.853 0 0 1 0-2.626v-.003z" fill="#FFCC00"/>
  </g>
</svg>`;


function prefersDark() {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

function injectStyle(document, css) {
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = css;
  (document.head || document.documentElement).appendChild(el);
}

function syncColor(document) {
  applyColorMode(
    document.documentElement,
    isDarkFromScheme(readDarkSchemeMedia(document), prefersDark())
  );
}

let faviconObserver;

function makeBrand(document) {
  const titleLink = document.querySelector(".d-header .title a");
  if (!titleLink || titleLink.querySelector(".wecom-brand")) return;
  const brand = document.createElement("span");
  brand.className = "wecom-brand";
  brand.setAttribute("aria-label", "企业微信");
  brand.innerHTML = `${WECOM_BRAND_SVG}<span>企业微信</span>`;
  titleLink.appendChild(brand);
}

const FAVICON_OBSERVE = {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["href", "rel", "type", "sizes"]
};

function setAttrIfChanged(el, name, value) {
  if (el.getAttribute(name) === value) return false;
  el.setAttribute(name, value);
  return true;
}

function makeFavicon(document) {
  const head = document.head;
  const logo = document.querySelector(".wecom-brand svg");
  if (!head || !logo || typeof XMLSerializer === "undefined") return;
  const href = `data:image/svg+xml,${encodeURIComponent(new XMLSerializer().serializeToString(logo))}`;
  let favicon = document.getElementById(FAVICON_ID);
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.id = FAVICON_ID;
    favicon.rel = "icon";
    head.appendChild(favicon);
  }
  if (faviconObserver) {
    faviconObserver.disconnect();
    faviconObserver.takeRecords();
  }
  for (const icon of head.querySelectorAll("link[rel~='icon']")) {
    setAttrIfChanged(icon, "type", "image/svg+xml");
    setAttrIfChanged(icon, "sizes", "any");
    setAttrIfChanged(icon, "href", href);
  }
  const Observer = document.defaultView?.MutationObserver;
  if (!faviconObserver && typeof Observer === "function") {
    faviconObserver = new Observer(() => makeFavicon(document));
  }
  if (faviconObserver) faviconObserver.observe(head, FAVICON_OBSERVE);
}

function makeDocIcons(document) {
  for (const mainLink of document.querySelectorAll(".topic-list-item .main-link")) {
    const titleLink = mainLink.querySelector("a.title") || mainLink.querySelector(".title");
    if (!titleLink) continue;
    if (titleLink.querySelector(".wecom-doc-icon")) continue;
    for (const orphan of mainLink.querySelectorAll(":scope > .wecom-doc-icon")) {
      orphan.remove();
    }
    const icon = document.createElement("span");
    icon.className = "wecom-doc-icon";
    icon.setAttribute("aria-hidden", "true");
    titleLink.prepend(icon);
  }
}

function makeCreateTopicButton(document) {
  const button = document.querySelector(
    ".navigation-container .create-topic, .list-controls .create-topic, .create-topic"
  );
  if (!button) return;
  button.classList.add("wecom-create-topic");
}

function makeTopicContext(document) {
  const headerContents = document.querySelector(".d-header .contents");
  if (!headerContents) return;
  const topicTitle = document.querySelector("#topic-title h1, #topic-title .fancy-title");
  let title = topicTitle?.textContent?.trim().replace(/\s+/g, " ");
  if (!title) title = topicTitleFromDocumentTitle(document.title);
  if (!title) return;
  let context = headerContents.querySelector(".wecom-topic-context");
  if (!context) {
    context = document.createElement("div");
    context.className = "wecom-topic-context";
    headerContents.appendChild(context);
  }
  const category = document.querySelector(
    "#topic-title .badge-category__name, #topic-title .badge-wrapper, #topic-title .category-name"
  );
  const categoryText = category?.textContent?.trim().replace(/\s+/g, " ") || "";
  const routeKey = `${location.pathname}|${title}|${categoryText}`;
  if (context.dataset.routeKey === routeKey) return;
  context.dataset.routeKey = routeKey;
  context.textContent = topicContextText(categoryText || null, title);
}

function applyTheme(document, css) {
  injectStyle(document, css);
  document.documentElement.classList.add(THEME_CLASS);
  syncColor(document);
  if (!document.body) return;
  const mode = applyPageMode(document.documentElement, document.body, location.pathname);
  runStep(() => makeBrand(document));
  runStep(() => makeFavicon(document));
  if (mode === "home") {
    document.querySelector(".wecom-topic-context")?.remove();
    runStep(() => makeCreateTopicButton(document));
    runStep(() => makeDocIcons(document));
  } else if (mode === "topic") {
    runStep(() => makeTopicContext(document));
  }
}

function bootstrap(document, css) {
  if (!document.documentElement) {
    setTimeout(() => bootstrap(document, css), 0);
    return;
  }
  applyTheme(document, css);
}

function bindNavigation(window, document, css) {
  if (window.__wecomNavBound) return;
  window.__wecomNavBound = true;
  let scheduled = false;
  let applying = false;
  const Observer = window.MutationObserver || globalThis.MutationObserver;
  const observer =
    typeof Observer === "function"
      ? new Observer(() => {
          if (applying) return;
          schedule();
        })
      : null;
  const schedule = () => {
    if (scheduled || applying) return;
    scheduled = true;
    const raf = window.requestAnimationFrame || ((cb) => setTimeout(cb, 0));
    raf(() => {
      scheduled = false;
      applying = true;
      try {
        applyTheme(document, css);
      } finally {
        observer?.takeRecords();
        applying = false;
      }
    });
  };
  observer?.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  for (const method of ["pushState", "replaceState"]) {
    const original = window.history[method];
    window.history[method] = function (...args) {
      const result = original.apply(this, args);
      schedule();
      return result;
    };
  }
  window.addEventListener("popstate", schedule);
  window.addEventListener("hashchange", schedule);
  document.addEventListener("turbo:load", schedule);
  document.addEventListener("page:changed", schedule);
  try {
    const colorMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const onColor = () => syncColor(document);
    if (colorMedia.addEventListener) colorMedia.addEventListener("change", onColor);
    else if (colorMedia.addListener) colorMedia.addListener(onColor);
  } catch {}
}

function start(document, css) {
  bootstrap(document, css);
  bindNavigation(window, document, css);
}


  start(document, CSS);
})();
