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
  const CSS = "/* tokens and layout added in later tasks */\n";
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

function applyTheme(document, css) {
  injectStyle(document, css);
  document.documentElement.classList.add(THEME_CLASS);
  syncColor(document);
  if (!document.body) return;
  applyPageMode(document.documentElement, document.body, location.pathname);
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
