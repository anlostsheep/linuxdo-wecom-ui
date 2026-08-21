export const THEME_CLASS = "wecom-doc-theme";
export const HOME_CLASS = "wecom-doc-home";
export const TOPIC_CLASS = "wecom-doc-topic";
export const DARK_CLASS = "wecom-dark";
export const STYLE_ID = "linuxdo-wecom-theme";
export const FAVICON_ID = "wecom-favicon";

export function isTopicPath(pathname) {
  return /^\/t\//.test(pathname);
}

export function isDarkFromScheme(media, prefersDark) {
  if (media == null) return false;
  if (media === "all") return true;
  if (media === "none") return false;
  return Boolean(prefersDark);
}

export function readDarkSchemeMedia(document) {
  const link = document.querySelector("link.dark-scheme");
  return link ? link.media : null;
}

export function applyColorMode(html, dark) {
  html.classList.toggle(DARK_CLASS, Boolean(dark));
}

export function applyPageMode(html, body, pathname) {
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

export function topicTitleFromDocumentTitle(title) {
  return String(title || "")
    .replace(/\s*[-–]\s*Linux DO\s*$/, "")
    .trim();
}

export function topicContextText(category, title) {
  const cat = (category && category.trim()) || "知识库";
  return `知识库 › ${cat} › ${title}`;
}

export function runStep(fn) {
  try {
    fn();
  } catch {
    /* keep later steps running */
  }
}
