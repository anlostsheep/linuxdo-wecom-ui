// ==UserScript==
// @name         Linux DO · 企业微信文档外观
// @namespace    https://linux.do/
// @version      1.0.0
// @description  将 Linux DO 的主页与话题页换成企业微信文档风格。浅色跟企微，深色跟 GitHub Soft dark。只换皮。
// @author       lostsheep
// @match        https://linux.do/*
// @icon         https://linux.do/favicon.ico
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";
  const CSS = "html.wecom-doc-theme {\n  color-scheme: light !important;\n  --wecom-bg: #ffffff;\n  --wecom-sidebar: #f6f7f9;\n  --wecom-line: #ebebeb;\n  --wecom-text: #1f1f1f;\n  --wecom-text-2: #6e6e6e;\n  --wecom-text-3: #8c8c8c;\n  --wecom-search: #f3f3f3;\n  --wecom-hover: #f0f0f0;\n  --wecom-active: rgba(18, 179, 168, 0.12);\n  --wecom-link: #12b3a8;\n  --wecom-doc: #4b8cff;\n  --wecom-header-h: 56px;\n  --wecom-nav-w: 248px;\n  --wecom-toc-w: 240px;\n  --wecom-comments-w: 320px;\n  --primary: #1f1f1f !important;\n  --secondary: #ffffff !important;\n  --header_background: #ffffff !important;\n  --header_primary: #1f1f1f !important;\n  --primary-low: #f6f7f9 !important;\n  --primary-very-low: #ffffff !important;\n  --d-hover: #f0f0f0 !important;\n}\n\nhtml.wecom-doc-theme.wecom-dark {\n  color-scheme: dark !important;\n  --wecom-bg: #212830;\n  --wecom-sidebar: #262c36;\n  --wecom-line: #3d444d;\n  --wecom-text: #d1d7e0;\n  --wecom-text-2: #9198a1;\n  --wecom-text-3: #9198a1;\n  --wecom-search: #2a313c;\n  --wecom-hover: #2f3742;\n  --wecom-active: rgba(61, 205, 196, 0.14);\n  --wecom-link: #3dcdc4;\n  --primary: #d1d7e0 !important;\n  --secondary: #212830 !important;\n  --header_background: #212830 !important;\n  --header_primary: #d1d7e0 !important;\n  --primary-low: #262c36 !important;\n  --primary-very-low: #151b23 !important;\n  --d-hover: #2f3742 !important;\n}\n\nhtml.wecom-doc-theme,\nhtml.wecom-doc-theme body {\n  background: var(--wecom-bg) !important;\n  color: var(--wecom-text) !important;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\",\n    \"Hiragino Sans GB\", \"Microsoft YaHei\", Arial, sans-serif !important;\n}\n\nhtml.wecom-doc-theme body {\n  min-width: 980px;\n  margin: 0 !important;\n}\n\nhtml.wecom-doc-theme a { color: inherit; }\nhtml.wecom-doc-theme .cooked a { color: var(--wecom-link) !important; }\n\nhtml.wecom-doc-theme .global-notice,\nhtml.wecom-doc-theme .category-breadcrumb,\nhtml.wecom-doc-theme .top-lists,\nhtml.wecom-doc-theme .navigation-controls,\nhtml.wecom-doc-theme .topic-map.--bottom {\n  display: none !important;\n}\n\nhtml.wecom-doc-theme .d-header-wrap,\nhtml.wecom-doc-theme body .d-header {\n  position: fixed !important;\n  z-index: 1101 !important;\n  top: 0 !important;\n  left: 0 !important;\n  right: 0 !important;\n  height: var(--wecom-header-h) !important;\n  background: var(--wecom-bg) !important;\n  border-bottom: 1px solid var(--wecom-line) !important;\n  box-shadow: none !important;\n}\n\nhtml.wecom-doc-theme #main-outlet-wrapper {\n  width: 100% !important;\n  max-width: none !important;\n  display: grid !important;\n  grid-template-columns: var(--wecom-nav-w) minmax(0, 1fr) !important;\n  min-height: calc(100vh - var(--wecom-header-h)) !important;\n  margin: 0 !important;\n  padding: 0 !important;\n}\n\nhtml.wecom-doc-theme .sidebar-wrapper {\n  width: var(--wecom-nav-w) !important;\n  min-width: var(--wecom-nav-w) !important;\n  background: var(--wecom-sidebar) !important;\n  border-right: 1px solid var(--wecom-line) !important;\n  box-shadow: none !important;\n}\n\nhtml.wecom-doc-theme #main-outlet {\n  background: var(--wecom-bg) !important;\n  padding-top: calc(var(--wecom-header-h) + 12px) !important;\n}\n\nhtml.wecom-doc-theme .sidebar-section-link-wrapper.is-active,\nhtml.wecom-doc-theme .sidebar-section-link.active {\n  background: var(--wecom-active) !important;\n  color: var(--wecom-link) !important;\n}\n\nhtml.wecom-doc-theme .d-header .title img,\nhtml.wecom-doc-theme .d-header .title picture,\nhtml.wecom-doc-theme .d-header .title .logo-big,\nhtml.wecom-doc-theme .d-header .title .logo-small {\n  display: none !important;\n}\nhtml.wecom-doc-theme .wecom-brand {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 16px;\n  font-weight: 600;\n}\nhtml.wecom-doc-theme .wecom-app-icon {\n  width: 28px;\n  height: 28px;\n}\n";
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

const WECOM_BRAND_SVG = `<svg class="wecom-app-icon" viewBox="0 0 48 48" aria-hidden="true">
  <rect x="1" y="1" width="46" height="46" rx="12" fill="#fff"/>
  <path fill="#3D9BFF" d="M11.8 20.8c0-6.35 6.55-11 13.4-11 6.85 0 13.4 4.65 13.4 11s-6.55 11-13.4 11c-1.55 0-3.05-.2-4.4-.6L13.2 35.2l2.55-4.55c-2.55-2.25-3.95-5.7-3.95-9.85z"/>
  <path stroke="#AEB6BF" stroke-width="1.35" stroke-linecap="round" fill="none" d="M31.6 27.2l3.5-3.6M31.6 27.2l-2.5 4.3M31.6 27.2l5.2 3.3"/>
  <circle cx="35.4" cy="23.2" r="2.55" fill="#62C05B"/>
  <circle cx="28.8" cy="31.8" r="2.7" fill="#FF8A3A"/>
  <circle cx="37.6" cy="31.1" r="2.35" fill="#F5C400"/>
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
  for (const icon of head.querySelectorAll("link[rel~='icon']")) {
    icon.setAttribute("type", "image/svg+xml");
    icon.setAttribute("sizes", "any");
    icon.setAttribute("href", href);
  }
  const Observer = document.defaultView?.MutationObserver;
  if (!faviconObserver && typeof Observer === "function") {
    faviconObserver = new Observer(() => makeFavicon(document));
    faviconObserver.observe(head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href", "rel", "type", "sizes"]
    });
  }
}

function applyTheme(document, css) {
  injectStyle(document, css);
  document.documentElement.classList.add(THEME_CLASS);
  syncColor(document);
  if (!document.body) return;
  applyPageMode(document.documentElement, document.body, location.pathname);
  runStep(() => makeBrand(document));
  runStep(() => makeFavicon(document));
}

function bootstrap(document, css) {
  if (!document.documentElement) {
    setTimeout(() => bootstrap(document, css), 0);
    return;
  }
  applyTheme(document, css);
}

function start(document, css) {
  bootstrap(document, css);
}

  start(document, CSS);
})();
