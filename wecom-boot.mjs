import {
  STYLE_ID,
  THEME_CLASS,
  FAVICON_ID,
  WECOM_BRAND_SVG,
  applyColorMode,
  applyPageMode,
  collectTocEntries,
  findOpPost,
  isDarkFromScheme,
  postsToDock,
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

export function makeTopicContext(document) {
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

export function ensureTopicShell(document) {
  const posts = document.querySelector(".container.posts") || document.querySelector("#main-outlet");
  if (!posts) return;
  const parent = posts.parentElement;
  if (!parent) return;
  let toc = document.querySelector("aside.wecom-toc");
  if (!toc) {
    toc = document.createElement("aside");
    toc.className = "wecom-toc";
  }
  if (toc.parentElement !== parent || toc.nextElementSibling !== posts) {
    parent.insertBefore(toc, posts);
  }
  let comments = document.querySelector("aside.wecom-comments");
  if (!comments) {
    comments = document.createElement("aside");
    comments.className = "wecom-comments";
    comments.innerHTML =
      '<div class="wecom-comments-head">评论</div><div class="wecom-comments-list"></div><div class="wecom-comments-empty">暂无评论</div>';
  }
  if (comments.parentElement !== parent || posts.nextElementSibling !== comments) {
    parent.insertBefore(comments, posts.nextSibling);
  }
}

export function makeToc(document) {
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

export function markCoverImage(document) {
  const cooked = findOpPost(document)?.querySelector(".cooked");
  if (!cooked) return;
  cooked.querySelectorAll("img.wecom-cover").forEach((img) => img.classList.remove("wecom-cover"));
  const img = cooked.querySelector("img");
  if (img) img.classList.add("wecom-cover");
}

export function bindNavDrawer(document) {
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

export function syncCommentsEmptyState(document) {
  const empty = document.querySelector(".wecom-comments-empty");
  const list = document.querySelector(".wecom-comments-list");
  if (!empty || !list) return;
  empty.hidden = list.querySelector(".topic-post") != null;
}

const dockedOpByDocument = new WeakMap();

export function dockComments(document) {
  const list = document.querySelector(".wecom-comments-list");
  if (!list) return;
  const op = findOpPost(document);
  if (op) dockedOpByDocument.set(document, op);
  for (const post of postsToDock(document)) {
    if (post.parentElement === list) continue;
    list.appendChild(post);
  }
  syncCommentsEmptyState(document);
}

export function restoreComments(document) {
  const list = document.querySelector(".wecom-comments-list");
  if (!list) return;
  const moved = [...list.querySelectorAll(".topic-post")];
  if (!moved.length) return;
  const stream = document.querySelector(".post-stream");
  const recordedOp = dockedOpByDocument.get(document);
  const belongsToCurrent = stream && (!recordedOp || stream.contains(recordedOp));
  const previous = recordedOp?.closest(".post-stream");
  const target = belongsToCurrent
    ? stream
    : previous?.isConnected && previous !== stream
      ? previous
      : null;
  if (!target) return;
  for (const post of moved) target.appendChild(post);
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
    const html = document.documentElement;
    const path = location.pathname;
    if (html.dataset.wecomTopicPath !== path) {
      runStep(() => restoreComments(document));
      const list = document.querySelector(".wecom-comments-list");
      const recordedOp = dockedOpByDocument.get(document);
      const op = findOpPost(document);
      if (list && recordedOp && op && recordedOp !== op) {
        for (const post of [...list.querySelectorAll(".topic-post")]) post.remove();
      }
    }
    html.dataset.wecomTopicPath = path;
    document.querySelector(".wecom-home-heading")?.remove();
    runStep(() => makeTopicContext(document));
    runStep(() => ensureTopicShell(document));
    runStep(() => dockComments(document));
    runStep(() => makeToc(document));
    runStep(() => markCoverImage(document));
    runStep(() => bindNavDrawer(document));
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
  const restoreAndSchedule = () => {
    restoreComments(document);
    schedule();
  };
  observer?.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  for (const method of ["pushState", "replaceState"]) {
    const original = window.history[method];
    window.history[method] = function (...args) {
      const result = original.apply(this, args);
      restoreAndSchedule();
      return result;
    };
  }
  window.addEventListener("popstate", restoreAndSchedule);
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
