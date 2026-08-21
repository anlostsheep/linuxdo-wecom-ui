import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import { collectTocEntries, findOpPost } from "../wecom-core.mjs";
import { ensureTopicShell, makeToc, markCoverImage } from "../wecom-boot.mjs";

describe("toc and cover", () => {
  it("reads h1-h3 only from OP cooked and keeps a root when empty", () => {
    const { window } = new JSDOM(`<!doctype html><html><body>
      <div id="topic-title"><h1>前端知识库</h1></div>
      <div class="container posts">
        <div class="post-stream">
          <div id="post_1" class="topic-post"><div class="cooked">
            <h2>概述</h2><h3>规范</h3><img src="https://example.com/c.png" alt="">
          </div></div>
          <div id="post_2" class="topic-post"><div class="cooked"><h2>回复里的标题</h2></div></div>
        </div>
      </div>
    </body></html>`);
    const document = window.document;
    const op = findOpPost(document);
    const entries = collectTocEntries(op.querySelector(".cooked"));
    assert.deepEqual(entries.map((e) => e.text), ["概述", "规范"]);
    ensureTopicShell(document);
    makeToc(document);
    const labels = [...document.querySelectorAll(".wecom-toc-item")].map((n) => n.textContent);
    assert.equal(labels[0], "前端知识库");
    assert.ok(labels.includes("概述"));
    assert.ok(!labels.includes("回复里的标题"));
    markCoverImage(document);
    assert.ok(document.querySelector("#post_1 .cooked img").classList.contains("wecom-cover"));
  });
});
