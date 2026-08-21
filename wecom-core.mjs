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

export const WECOM_BRAND_SVG = `<svg class="wecom-app-icon" viewBox="0 0 48 48" aria-hidden="true">
  <rect x="1" y="1" width="46" height="46" rx="12" fill="#fff"/>
  <path fill="#3D9BFF" d="M11.8 20.8c0-6.35 6.55-11 13.4-11 6.85 0 13.4 4.65 13.4 11s-6.55 11-13.4 11c-1.55 0-3.05-.2-4.4-.6L13.2 35.2l2.55-4.55c-2.55-2.25-3.95-5.7-3.95-9.85z"/>
  <path stroke="#AEB6BF" stroke-width="1.35" stroke-linecap="round" fill="none" d="M31.6 27.2l3.5-3.6M31.6 27.2l-2.5 4.3M31.6 27.2l5.2 3.3"/>
  <circle cx="35.4" cy="23.2" r="2.55" fill="#62C05B"/>
  <circle cx="28.8" cy="31.8" r="2.7" fill="#FF8A3A"/>
  <circle cx="37.6" cy="31.1" r="2.35" fill="#F5C400"/>
</svg>`;
