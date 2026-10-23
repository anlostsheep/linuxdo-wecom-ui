import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import { THEME_CLASS } from "../wecom-core.mjs";
import { applyTheme, bindNavigation, start } from "../wecom-boot.mjs";

describe("bootstrap", () => {
  it("applies theme class and coalesces history updates", async () => {
    const { window } = new JSDOM(
      `<!doctype html><html><head></head><body>
        <header class="d-header"><div class="title"><a href="/"></a></div><div class="contents"></div></header>
      </body></html>`,
      { url: "https://linux.do/" }
    );
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
    }
    globalThis.window = window;
    globalThis.location = window.location;
    globalThis.MutationObserver = window.MutationObserver;
    start(window.document, "/* test css */");
    assert.ok(window.document.documentElement.classList.contains(THEME_CLASS));
    bindNavigation(window, window.document, "/* test css */");
    window.history.pushState({}, "", "/t/demo/1");
    await new Promise((r) => window.requestAnimationFrame(r));
    assert.ok(window.document.documentElement.classList.contains("wecom-doc-topic"));
  });

  it("keeps only the OP uncloaked instead of disabling cloaking globally", () => {
    const { window } = new JSDOM(
      `<!doctype html><html><body>
        <div class="container posts"><div class="post-stream">
          <div class="topic-post"><article id="post_1" data-post-id="99"></article></div>
        </div></div>
      </body></html>`,
      { url: "https://linux.do/t/x/1" }
    );
    let called = false;
    const prevented = [];
    window.require = (name) => {
      if (name === "discourse/modifiers/post-stream-viewport-tracker") {
        return {
          disableCloaking() { called = true; },
          preventCloaking(id) { prevented.push(id); }
        };
      }
      throw new Error(name);
    };
    globalThis.window = window;
    globalThis.location = window.location;
    applyTheme(window.document, "/* css */");
    assert.equal(called, false);
    assert.deepEqual(prevented, [99]);
    assert.ok(window.document.querySelector(".topic-post.wecom-op-post"));
  });

  it("restores the disguised title in hidden tabs where rAF never runs", async () => {
    const { window } = new JSDOM(
      `<!doctype html><html><head><title>t</title></head><body>
        <header class="d-header"><div class="title"><a href="/"></a></div><div class="contents"></div></header>
        <div id="topic-title"><h1>文档标题</h1></div>
      </body></html>`,
      { url: "https://linux.do/t/topic/1" }
    );
    window.requestAnimationFrame = () => 0;
    globalThis.window = window;
    globalThis.location = window.location;
    globalThis.MutationObserver = window.MutationObserver;
    start(window.document, "/* css */");
    assert.equal(window.document.title, "文档标题 - 企业微信");
    window.document.title = "(3) 文档标题 - 前沿快讯 - LINUX DO";
    await new Promise((r) => setTimeout(r, 0));
    assert.equal(window.document.title, "文档标题 - 企业微信");
  });
});

