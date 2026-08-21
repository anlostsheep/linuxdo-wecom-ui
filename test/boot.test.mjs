import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import { THEME_CLASS } from "../wecom-core.mjs";
import { bindNavigation, dockComments, ensureTopicShell, start } from "../wecom-boot.mjs";

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

  it("restores comments synchronously on pushState, replaceState, and popstate", () => {
    const { window } = new JSDOM(
      `<!doctype html><html><body>
        <div class="container posts">
          <div class="post-stream">
            <div id="post_1" class="topic-post"><div class="cooked">OP</div></div>
            <div id="post_2" class="topic-post"><div class="cooked">reply</div></div>
          </div>
        </div>
      </body></html>`,
      { url: "https://linux.do/t/a/1" }
    );
    const document = window.document;
    globalThis.window = window;
    globalThis.location = window.location;
    globalThis.MutationObserver = window.MutationObserver;
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
    }
    ensureTopicShell(document);
    dockComments(document);
    bindNavigation(window, document, "/* test css */");
    const list = document.querySelector(".wecom-comments-list");
    const stream = document.querySelector(".post-stream");
    const reply = document.querySelector("#post_2");

    const assertRestoredNow = (navigate) => {
      if (reply.parentElement !== list) list.appendChild(reply);
      assert.equal(reply.parentElement, list);
      navigate();
      assert.equal(reply.parentElement, stream);
      assert.equal(list.querySelectorAll(".topic-post").length, 0);
    };

    assertRestoredNow(() => window.history.pushState({}, "", "/t/b/2"));
    assertRestoredNow(() => window.history.replaceState({}, "", "/t/c/3"));
    assertRestoredNow(() => window.dispatchEvent(new window.PopStateEvent("popstate")));
  });
});
