import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import { TOPIC_CLASS } from "../wecom-core.mjs";
import { ensureTopicShell, makeTopicContext } from "../wecom-boot.mjs";

describe("topic chrome", () => {
  it("builds crumbs without fake 内部使用 status and shells once", () => {
    const { window } = new JSDOM(`<!doctype html><html class="${TOPIC_CLASS}"><body>
      <header class="d-header"><div class="contents"></div></header>
      <div id="main-outlet-wrapper">
        <div class="sidebar-wrapper"></div>
        <div id="main-outlet">
          <div id="topic-title"><h1>前端知识库</h1>
            <span class="badge-category__name">前端</span>
          </div>
          <div class="container posts"><div class="post-stream"></div></div>
        </div>
      </div>
    </body></html>`, { url: "https://linux.do/t/x/1" });
    const document = window.document;
    globalThis.location = window.location;
    makeTopicContext(document);
    makeTopicContext(document);
    const ctx = document.querySelector(".wecom-topic-context");
    assert.equal(document.querySelectorAll(".wecom-topic-context").length, 1);
    assert.equal(ctx.textContent, "知识库 › 前端 › 前端知识库");
    assert.doesNotMatch(ctx.textContent, /内部使用/);
    ensureTopicShell(document);
    ensureTopicShell(document);
    assert.equal(document.querySelectorAll("aside.wecom-toc").length, 1);
    assert.equal(document.querySelectorAll("aside.wecom-comments").length, 1);
  });
});
