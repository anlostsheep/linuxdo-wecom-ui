import {
  STYLE_ID,
  THEME_CLASS,
  FAVICON_ID,
  WECOM_BRAND_SVG,
  applyColorMode,
  applyPageMode,
  isDarkFromScheme,
  readDarkSchemeMedia,
  runStep
} from "./wecom-core.mjs";

export function prefersDark() {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

export function injectStyle(document, css) {
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = css;
  (document.head || document.documentElement).appendChild(el);
}

export function syncColor(document) {
  applyColorMode(
    document.documentElement,
    isDarkFromScheme(readDarkSchemeMedia(document), prefersDark())
  );
}

let faviconObserver;

export function makeBrand(document) {
  const titleLink = document.querySelector(".d-header .title a");
  if (!titleLink || titleLink.querySelector(".wecom-brand")) return;
  const brand = document.createElement("span");
  brand.className = "wecom-brand";
  brand.setAttribute("aria-label", "企业微信");
  brand.innerHTML = `${WECOM_BRAND_SVG}<span>企业微信</span>`;
  titleLink.appendChild(brand);
}

export function makeFavicon(document) {
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

export function makeHomeHeading(document) {
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

export function makeSidebarSearch(document) {
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

export function makeColumnLabels(document) {
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

export function makeDocIcons(document) {
  for (const link of document.querySelectorAll(".topic-list-item .main-link")) {
    if (link.querySelector(":scope > .wecom-doc-icon")) continue;
    const icon = document.createElement("span");
    icon.className = "wecom-doc-icon";
    icon.setAttribute("aria-hidden", "true");
    link.prepend(icon);
  }
}

export function makeCreateTopicButton(document) {
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

export function applyTheme(document, css) {
  injectStyle(document, css);
  document.documentElement.classList.add(THEME_CLASS);
  syncColor(document);
  if (!document.body) return;
  const mode = applyPageMode(document.documentElement, document.body, location.pathname);
  runStep(() => makeBrand(document));
  runStep(() => makeFavicon(document));
  runStep(() => makeSidebarSearch(document));
  if (mode === "home") {
    runStep(() => makeHomeHeading(document));
    runStep(() => makeCreateTopicButton(document));
    runStep(() => makeColumnLabels(document));
    runStep(() => makeDocIcons(document));
  }
}

export function bootstrap(document, css) {
  if (!document.documentElement) {
    setTimeout(() => bootstrap(document, css), 0);
    return;
  }
  applyTheme(document, css);
}

export function start(document, css) {
  bootstrap(document, css);
}
