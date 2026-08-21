import {
  STYLE_ID,
  THEME_CLASS,
  FAVICON_ID,
  WECOM_BRAND_SVG,
  applyColorMode,
  applyPageMode,
  isDarkFromScheme,
  readDarkSchemeMedia,
  runStep,
  topicContextText,
  topicTitleFromDocumentTitle
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

export function makeDocIcons(document) {
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

export function makeCreateTopicButton(document) {
  const button = document.querySelector(
    ".navigation-container .create-topic, .list-controls .create-topic, .create-topic"
  );
  if (!button) return;
  button.classList.add("wecom-create-topic");
}

export function makeTopicContext(document) {
  const headerContents = document.querySelector(".d-header .contents");
  if (!headerContents) return;
  const topicTitle = document.querySelector("#topic-title h1, #topic-title .fancy-title");
  let rawTitle = topicTitle?.textContent?.trim().replace(/\s+/g, " ") || "";
  let title = topicTitleFromDocumentTitle(rawTitle || document.title);
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

export function makeDocumentTitle(document, isTopic) {
  if (isTopic) {
    const topicTitle = document.querySelector("#topic-title h1, #topic-title .fancy-title");
    let rawTitle = topicTitle?.textContent?.trim().replace(/\s+/g, " ") || "";
    let title = topicTitleFromDocumentTitle(rawTitle || document.title);
    if (title) {
      const expected = `${title} - 企业微信`;
      if (document.title !== expected) {
        document.title = expected;
      }
    }
  } else {
    if (document.title !== "企业微信") {
      document.title = "企业微信";
    }
  }
}

export function removeLeftoverToc(document) {
  for (const toc of document.querySelectorAll("aside.wecom-toc")) {
    toc.remove();
  }
}

export function applyTheme(document, css) {
  injectStyle(document, css);
  document.documentElement.classList.add(THEME_CLASS);
  syncColor(document);
  if (!document.body) return;
  const mode = applyPageMode(document.documentElement, document.body, location.pathname);
  runStep(() => makeBrand(document));
  runStep(() => makeFavicon(document));
  runStep(() => removeLeftoverToc(document));
  if (mode === "home") {
    document.querySelector(".wecom-topic-context")?.remove();
    runStep(() => makeDocumentTitle(document, false));
    runStep(() => makeCreateTopicButton(document));
    runStep(() => makeDocIcons(document));
  } else if (mode === "topic") {
    runStep(() => makeTopicContext(document));
    runStep(() => makeDocumentTitle(document, true));
  }
}

export function bootstrap(document, css) {
  if (!document.documentElement) {
    setTimeout(() => bootstrap(document, css), 0);
    return;
  }
  applyTheme(document, css);
}

export function bindNavigation(window, document, css) {
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

export function start(document, css) {
  bootstrap(document, css);
  bindNavigation(window, document, css);
}

