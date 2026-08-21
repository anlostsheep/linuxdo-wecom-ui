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
// @name         Linux DO · 企业微信智能文档外观
// @namespace    https://linux.do/
// @version      2.0.0
// @description  将 Linux DO 深度改版为企业微信智能文档/团队知识库版式。主页文件表、话题页文档画布与TOC目录、轻量协作评论流。
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
