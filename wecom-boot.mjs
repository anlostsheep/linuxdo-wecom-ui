import {
  STYLE_ID,
  THEME_CLASS,
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

export function applyTheme(document, css) {
  injectStyle(document, css);
  document.documentElement.classList.add(THEME_CLASS);
  syncColor(document);
  if (!document.body) return;
  applyPageMode(document.documentElement, document.body, location.pathname);
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
