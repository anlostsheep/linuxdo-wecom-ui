import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import { applyTheme } from "../wecom-boot.mjs";

describe("topic cooked content and spacious layout", () => {
  it("preserves headings, blockquotes, and links in cooked post without artificial TOC squeezing", () => {
    const { window } = new JSDOM(`<!doctype html><html><body>
      <div id="main-outlet">
        <div id="topic-title"><h1>前端知识库</h1></div>
        <div class="container posts">
          <div class="post-stream">
            <div id="post_1" class="topic-post"><div class="cooked">
              <h2>概述</h2>
              <aside class="quote">引用内容</aside>
              <p><a href="/test">链接</a></p>
            </div></div>
          </div>
        </div>
      </div>
    </body></html>`, { url: "https://linux.do/t/test/1" });
    const document = window.document;
    globalThis.window = window;
    globalThis.location = window.location;
    applyTheme(document, "/* css */");
    const cooked = document.querySelector("#post_1 .cooked");
    assert.ok(cooked);
    assert.equal(cooked.querySelector("h2")?.textContent, "概述");
    assert.equal(cooked.querySelector("aside.quote")?.textContent, "引用内容");

    const toc = document.querySelector("aside.wecom-toc");
    assert.equal(toc, null, "should not inject duplicate aside.wecom-toc");
  });
});

