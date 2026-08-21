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
  const CSS = "html.wecom-doc-theme {\n  color-scheme: light !important;\n  --wecom-bg: #ffffff;\n  --wecom-sidebar: #f6f7f9;\n  --wecom-line: #ebebeb;\n  --wecom-text: #1f1f1f;\n  --wecom-text-2: #6e6e6e;\n  --wecom-text-3: #8c8c8c;\n  --wecom-search: #f3f3f3;\n  --wecom-hover: #f0f0f0;\n  --wecom-active: rgba(18, 179, 168, 0.12);\n  --wecom-link: #12b3a8;\n  --wecom-doc: #4b8cff;\n  --wecom-header-h: 56px;\n  --wecom-nav-w: 248px;\n  --wecom-toc-w: 240px;\n  --wecom-comments-w: 320px;\n  --primary: #1f1f1f !important;\n  --secondary: #ffffff !important;\n  --header_background: #ffffff !important;\n  --header_primary: #1f1f1f !important;\n  --primary-low: #f6f7f9 !important;\n  --primary-very-low: #ffffff !important;\n  --d-hover: #f0f0f0 !important;\n}\n\nhtml.wecom-doc-theme.wecom-dark {\n  color-scheme: dark !important;\n  --wecom-bg: #212830;\n  --wecom-sidebar: #262c36;\n  --wecom-line: #3d444d;\n  --wecom-text: #d1d7e0;\n  --wecom-text-2: #9198a1;\n  --wecom-text-3: #9198a1;\n  --wecom-search: #2a313c;\n  --wecom-hover: #2f3742;\n  --wecom-active: rgba(61, 205, 196, 0.14);\n  --wecom-link: #3dcdc4;\n  --primary: #d1d7e0 !important;\n  --secondary: #212830 !important;\n  --header_background: #212830 !important;\n  --header_primary: #d1d7e0 !important;\n  --primary-low: #262c36 !important;\n  --primary-very-low: #151b23 !important;\n  --d-hover: #2f3742 !important;\n}\n\nhtml.wecom-doc-theme,\nhtml.wecom-doc-theme body {\n  background: var(--wecom-bg) !important;\n  color: var(--wecom-text) !important;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\",\n    \"Hiragino Sans GB\", \"Microsoft YaHei\", Arial, sans-serif !important;\n}\n\nhtml.wecom-doc-theme body {\n  min-width: 980px;\n  margin: 0 !important;\n}\n\nhtml.wecom-doc-theme a { color: inherit; }\nhtml.wecom-doc-theme .cooked a { color: var(--wecom-link) !important; }\n\nhtml.wecom-doc-theme .global-notice,\nhtml.wecom-doc-theme .category-breadcrumb,\nhtml.wecom-doc-theme .top-lists,\nhtml.wecom-doc-theme .navigation-controls,\nhtml.wecom-doc-theme .topic-map.--bottom {\n  display: none !important;\n}\n\nhtml.wecom-doc-theme .d-header-wrap,\nhtml.wecom-doc-theme body .d-header {\n  position: fixed !important;\n  z-index: 1101 !important;\n  top: 0 !important;\n  left: 0 !important;\n  right: 0 !important;\n  height: var(--wecom-header-h) !important;\n  background: var(--wecom-bg) !important;\n  border-bottom: 1px solid var(--wecom-line) !important;\n  box-shadow: none !important;\n}\n\nhtml.wecom-doc-theme #main-outlet-wrapper {\n  width: 100% !important;\n  max-width: none !important;\n  display: grid !important;\n  grid-template-columns: var(--wecom-nav-w) minmax(0, 1fr) !important;\n  min-height: calc(100vh - var(--wecom-header-h)) !important;\n  margin: 0 !important;\n  padding: 0 !important;\n}\n\nhtml.wecom-doc-theme .sidebar-wrapper {\n  width: var(--wecom-nav-w) !important;\n  min-width: var(--wecom-nav-w) !important;\n  background: var(--wecom-sidebar) !important;\n  border-right: 1px solid var(--wecom-line) !important;\n  box-shadow: none !important;\n}\n\nhtml.wecom-doc-theme #main-outlet {\n  background: var(--wecom-bg) !important;\n  padding-top: calc(var(--wecom-header-h) + 12px) !important;\n}\n\nhtml.wecom-doc-theme .sidebar-section-link-wrapper.is-active,\nhtml.wecom-doc-theme .sidebar-section-link.active {\n  background: var(--wecom-active) !important;\n  color: var(--wecom-link) !important;\n}\n\nhtml.wecom-doc-theme .d-header .title img,\nhtml.wecom-doc-theme .d-header .title picture,\nhtml.wecom-doc-theme .d-header .title .logo-big,\nhtml.wecom-doc-theme .d-header .title .logo-small {\n  display: none !important;\n}\nhtml.wecom-doc-theme .wecom-brand {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 16px;\n  font-weight: 600;\n}\nhtml.wecom-doc-theme .wecom-app-icon {\n  width: 28px;\n  height: 28px;\n}\n\nhtml.wecom-doc-theme .wecom-home-heading {\n  position: absolute;\n  left: calc(var(--wecom-nav-w) + 16px);\n  top: 0;\n  height: var(--wecom-header-h);\n  display: flex;\n  align-items: center;\n  font-size: 16px;\n  font-weight: 600;\n  pointer-events: none;\n}\nhtml.wecom-doc-theme.wecom-doc-home .topic-list-header th {\n  font-size: 0 !important;\n  color: var(--wecom-text-3) !important;\n  border-bottom: 1px solid var(--wecom-line) !important;\n}\nhtml.wecom-doc-theme.wecom-doc-home .wecom-column-label {\n  font-size: 13px;\n  color: var(--wecom-text-3);\n}\nhtml.wecom-doc-theme.wecom-doc-home .topic-list-item .main-link {\n  display: flex !important;\n  align-items: center;\n  gap: 10px;\n}\nhtml.wecom-doc-theme .wecom-doc-icon {\n  width: 22px;\n  height: 22px;\n  border-radius: 5px;\n  flex: none;\n  background: #4b8cff;\n  position: relative;\n}\nhtml.wecom-doc-theme .wecom-doc-icon::before {\n  content: \"\";\n  position: absolute;\n  left: 5px;\n  right: 5px;\n  top: 6px;\n  bottom: 6px;\n  background:\n    linear-gradient(#fff, #fff) 0 0 / 100% 2px no-repeat,\n    linear-gradient(#fff, #fff) 0 5px / 100% 2px no-repeat,\n    linear-gradient(#fff, #fff) 0 10px / 70% 2px no-repeat;\n}\nhtml.wecom-doc-theme.wecom-doc-home .wecom-create-topic {\n  font-size: 0 !important;\n}\nhtml.wecom-doc-theme.wecom-doc-home .wecom-create-topic::after {\n  content: \"新建话题\";\n  font-size: 14px;\n  color: var(--wecom-text-2);\n}\nhtml.wecom-doc-theme .wecom-sidebar-search {\n  display: flex;\n  align-items: center;\n  height: 36px;\n  margin: 0 8px 8px;\n  padding: 0 12px;\n  border-radius: 8px;\n  background: var(--wecom-bg);\n  color: var(--wecom-text-2) !important;\n  text-decoration: none !important;\n}\n\nhtml.wecom-doc-theme.wecom-doc-topic #main-outlet-wrapper {\n  grid-template-columns: minmax(0, 1fr) !important;\n  grid-template-areas: none !important;\n}\nhtml.wecom-doc-theme.wecom-doc-topic #main-outlet {\n  display: grid !important;\n  grid-template-columns: var(--wecom-toc-w) minmax(0, 1fr) var(--wecom-comments-w) !important;\n  align-items: start !important;\n}\nhtml.wecom-doc-theme.wecom-doc-topic aside.wecom-toc { grid-column: 1; }\nhtml.wecom-doc-theme.wecom-doc-topic #topic-title,\nhtml.wecom-doc-theme.wecom-doc-topic .container.posts { grid-column: 2; }\nhtml.wecom-doc-theme.wecom-doc-topic aside.wecom-comments { grid-column: 3; }\nhtml.wecom-doc-theme.wecom-doc-topic .sidebar-wrapper {\n  position: fixed !important;\n  z-index: 1200 !important;\n  top: var(--wecom-header-h) !important;\n  left: 0 !important;\n  height: calc(100vh - var(--wecom-header-h)) !important;\n  transform: translateX(-110%);\n  transition: transform 160ms ease;\n}\nhtml.wecom-doc-theme.wecom-doc-topic.wecom-nav-open .sidebar-wrapper {\n  transform: translateX(0);\n}\nhtml.wecom-doc-theme .wecom-topic-context {\n  position: absolute;\n  left: 72px;\n  right: 280px;\n  top: 0;\n  height: var(--wecom-header-h);\n  display: flex;\n  align-items: center;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--wecom-text-2);\n  font-size: 14px;\n  pointer-events: none;\n}\nhtml.wecom-doc-theme.wecom-doc-topic .topic-navigation,\nhtml.wecom-doc-theme.wecom-doc-topic .timeline-container {\n  display: none !important;\n}\nhtml.wecom-doc-theme aside.wecom-toc {\n  background: var(--wecom-sidebar);\n  border-right: 1px solid var(--wecom-line);\n  min-height: calc(100vh - var(--wecom-header-h));\n  padding: 16px 8px;\n}\nhtml.wecom-doc-theme aside.wecom-comments {\n  background: var(--wecom-bg);\n  border-left: 1px solid var(--wecom-line);\n  min-height: calc(100vh - var(--wecom-header-h));\n}\nhtml.wecom-doc-theme .wecom-comments-head {\n  height: 48px;\n  display: flex;\n  align-items: center;\n  padding: 0 16px;\n  font-weight: 600;\n  border-bottom: 1px solid var(--wecom-line);\n}\nhtml.wecom-doc-theme.wecom-doc-topic #topic-title h1,\nhtml.wecom-doc-theme.wecom-doc-topic .fancy-title {\n  font-size: 34px !important;\n  font-weight: 700 !important;\n  letter-spacing: -0.6px;\n}\nhtml.wecom-doc-theme.wecom-doc-topic .cooked img.wecom-cover {\n  display: block;\n  width: 100%;\n  max-height: 220px;\n  object-fit: cover;\n  border-radius: 8px;\n  margin: 0 0 24px;\n}\nhtml.wecom-doc-theme .wecom-toc-item {\n  display: block;\n  width: 100%;\n  text-align: left;\n  border: 0;\n  background: transparent;\n  color: var(--wecom-text-2);\n  padding: 6px 8px;\n  border-radius: 6px;\n  cursor: pointer;\n}\nhtml.wecom-doc-theme .wecom-toc-root { color: var(--wecom-text); font-size: 14px; }\nhtml.wecom-doc-theme .wecom-toc-l2 { padding-left: 22px; }\nhtml.wecom-doc-theme .wecom-toc-l3 { padding-left: 36px; }\nhtml.wecom-doc-theme .wecom-toc-item.active { color: var(--wecom-link); background: var(--wecom-active); }\n";
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

function findOpPost(document) {
  return document.querySelector("#post_1") || document.querySelector(".post-stream .topic-post");
}

function collectTocEntries(cooked) {
  if (!cooked) return [];
  const out = [];
  cooked.querySelectorAll("h1, h2, h3").forEach((heading, index) => {
    const text = heading.textContent.trim().replace(/\s+/g, " ");
    if (!text) return;
    if (!heading.id) heading.id = `wecom-h-${index}`;
    out.push({
      id: heading.id,
      level: Number(heading.tagName.slice(1)),
      text
    });
  });
  return out;
}

function postsToDock(document) {
  const op = findOpPost(document);
  const stream = document.querySelector(".post-stream");
  if (!stream) return [];
  return [...stream.querySelectorAll(".topic-post")].filter((post) => post !== op);
}


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

function makeHomeHeading(document) {
  const headerContents = document.querySelector(".d-header .contents");
  if (!headerContents) return;
  let heading = document.querySelector(".wecom-home-heading");
  if (!heading) {
    heading = document.createElement("div");
    heading.className = "wecom-home-heading";
    heading.textContent = "主页";
  }
  if (heading.parentElement !== headerContents) headerContents.appendChild(heading);
}

function makeSidebarSearch(document) {
  const container = document.querySelector(".sidebar-container");
  if (!container || container.querySelector(".wecom-sidebar-search")) return;
  const search = document.createElement("a");
  search.className = "wecom-sidebar-search";
  search.href = "/search";
  search.textContent = "搜索";
  const sections = container.querySelector(".sidebar-sections") || container.firstElementChild;
  if (sections) container.insertBefore(search, sections);
  else container.prepend(search);
}

function makeColumnLabels(document) {
  const labels = [
    ["th.default, th.main-link", "标题"],
    ["th.posters", "所有者"],
    ["th.posts", "回复"],
    ["th.views", "浏览量"],
    ["th.activity", "最近访问 ↓"]
  ];
  for (const [selector, label] of labels) {
    for (const cell of document.querySelectorAll(`.topic-list-header ${selector}`)) {
      let span = cell.querySelector(":scope > .wecom-column-label");
      if (!span) {
        span = document.createElement("span");
        span.className = "wecom-column-label";
        cell.prepend(span);
      }
      if (span.textContent !== label) span.textContent = label;
    }
  }
}

function makeDocIcons(document) {
  for (const link of document.querySelectorAll(".topic-list-item .main-link")) {
    if (link.querySelector(":scope > .wecom-doc-icon")) continue;
    const icon = document.createElement("span");
    icon.className = "wecom-doc-icon";
    icon.setAttribute("aria-hidden", "true");
    link.prepend(icon);
  }
}

function makeCreateTopicButton(document) {
  const button = document.querySelector(
    ".navigation-container .create-topic, .list-controls .create-topic, .create-topic"
  );
  if (!button) return;
  button.classList.add("wecom-create-topic");
  const navigationContainer = document.querySelector(".navigation-container");
  if (!navigationContainer) return;
  let slot = navigationContainer.querySelector(":scope > .wecom-create-topic-slot");
  if (!slot) {
    slot = document.createElement("div");
    slot.className = "wecom-create-topic-slot";
    navigationContainer.appendChild(slot);
  }
  if (button.parentElement !== slot) slot.appendChild(button);
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

function ensureTopicShell(document) {
  const posts = document.querySelector(".container.posts") || document.querySelector("#main-outlet");
  if (!posts) return;
  let toc = document.querySelector("aside.wecom-toc");
  if (!toc) {
    toc = document.createElement("aside");
    toc.className = "wecom-toc";
    posts.parentElement.insertBefore(toc, posts);
  }
  let comments = document.querySelector("aside.wecom-comments");
  if (!comments) {
    comments = document.createElement("aside");
    comments.className = "wecom-comments";
    comments.innerHTML =
      '<div class="wecom-comments-head">评论</div><div class="wecom-comments-list"></div><div class="wecom-comments-empty">暂无评论</div>';
    posts.parentElement.appendChild(comments);
  }
}

function makeToc(document) {
  const toc = document.querySelector("aside.wecom-toc");
  if (!toc) return;
  const title =
    document.querySelector("#topic-title h1, #topic-title .fancy-title")?.textContent
      ?.trim()
      .replace(/\s+/g, " ") || topicTitleFromDocumentTitle(document.title) || "文档";
  const op = findOpPost(document);
  const entries = collectTocEntries(op?.querySelector(".cooked"));
  const key = `${title}|${entries.map((e) => e.id).join(",")}`;
  if (toc.dataset.routeKey === key) return;
  toc.dataset.routeKey = key;
  toc.replaceChildren();
  const root = document.createElement("button");
  root.type = "button";
  root.className = "wecom-toc-item wecom-toc-root";
  root.textContent = title;
  root.addEventListener("click", () => op?.scrollIntoView({ block: "start" }));
  toc.appendChild(root);
  for (const entry of entries) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `wecom-toc-item wecom-toc-l${entry.level}`;
    item.textContent = entry.text;
    item.addEventListener("click", () => {
      document.getElementById(entry.id)?.scrollIntoView({ block: "start" });
    });
    toc.appendChild(item);
  }
}

function markCoverImage(document) {
  const cooked = findOpPost(document)?.querySelector(".cooked");
  if (!cooked) return;
  cooked.querySelectorAll("img.wecom-cover").forEach((img) => img.classList.remove("wecom-cover"));
  const img = cooked.querySelector("img");
  if (img) img.classList.add("wecom-cover");
}

function bindNavDrawer(document) {
  const html = document.documentElement;
  if (html.dataset.wecomNavBound) return;
  html.dataset.wecomNavBound = "1";
  html.addEventListener("click", (event) => {
    const target = event.target;
    if (!target || typeof target.closest !== "function") return;
    const button = target.closest("button");
    if (!button?.closest(".header-sidebar-toggle, .hamburger-dropdown")) return;
    html.classList.toggle("wecom-nav-open");
  });
}

function syncCommentsEmptyState(document) {
  const empty = document.querySelector(".wecom-comments-empty");
  const list = document.querySelector(".wecom-comments-list");
  if (!empty || !list) return;
  empty.hidden = list.querySelector(".topic-post") != null;
}

function dockComments(document) {
  const list = document.querySelector(".wecom-comments-list");
  if (!list) return;
  for (const post of postsToDock(document)) {
    if (post.parentElement === list) continue;
    list.appendChild(post);
  }
  syncCommentsEmptyState(document);
}

function restoreComments(document) {
  const list = document.querySelector(".wecom-comments-list");
  const stream = document.querySelector(".post-stream");
  if (!list || !stream) return;
  const moved = [...list.querySelectorAll(".topic-post")];
  for (const post of moved) stream.appendChild(post);
}

function applyTheme(document, css) {
  injectStyle(document, css);
  document.documentElement.classList.add(THEME_CLASS);
  syncColor(document);
  if (!document.body) return;
  const mode = applyPageMode(document.documentElement, document.body, location.pathname);
  runStep(() => makeBrand(document));
  runStep(() => makeFavicon(document));
  runStep(() => makeSidebarSearch(document));
  if (mode === "home") {
    runStep(() => restoreComments(document));
    document.querySelector("aside.wecom-toc")?.remove();
    if (!document.querySelector("aside.wecom-comments .topic-post")) {
      document.querySelector("aside.wecom-comments")?.remove();
    }
    document.querySelector(".wecom-topic-context")?.remove();
    runStep(() => makeHomeHeading(document));
    runStep(() => makeCreateTopicButton(document));
    runStep(() => makeColumnLabels(document));
    runStep(() => makeDocIcons(document));
  } else if (mode === "topic") {
    document.querySelector(".wecom-home-heading")?.remove();
    runStep(() => makeTopicContext(document));
    runStep(() => ensureTopicShell(document));
    runStep(() => dockComments(document));
    runStep(() => makeToc(document));
    runStep(() => markCoverImage(document));
    runStep(() => bindNavDrawer(document));
  }
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
