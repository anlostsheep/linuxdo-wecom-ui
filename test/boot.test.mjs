import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import { THEME_CLASS } from "../wecom-core.mjs";
import { bindNavigation, start } from "../wecom-boot.mjs";

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
});
