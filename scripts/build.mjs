import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function stripModule(src) {
  return src
    .replace(/^import[\s\S]*?from\s+["'][^"']+["'];?\n/gm, "")
    .replace(/^export /gm, "");
}

const header = `// ==UserScript==
// @name         Linux DO · 企业微信文档外观
// @namespace    https://linux.do/
// @version      1.2.2
// @description  将 Linux DO 的主页与话题页换成企业微信文档风格。浅色跟企微，深色跟 GitHub Soft dark。只换皮。
// @author       lostsheep
// @match        https://linux.do/*
// @icon         https://linux.do/favicon.ico
// @grant        none
// @run-at       document-start
// ==/UserScript==

`;

const css = readFileSync(join(root, "wecom-style.css"), "utf8");
const core = stripModule(readFileSync(join(root, "wecom-core.mjs"), "utf8"));
const boot = stripModule(readFileSync(join(root, "wecom-boot.mjs"), "utf8"));

const out = `${header}(function () {
  "use strict";
  const CSS = ${JSON.stringify(css)};
${core}
${boot}
  start(document, CSS);
})();
`;

writeFileSync(join(root, "linuxdo-wecom.user.js"), out);
