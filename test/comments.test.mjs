import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import { postsToDock } from "../wecom-core.mjs";
import { dockComments, ensureTopicShell, restoreComments } from "../wecom-boot.mjs";

function topicWithReplies() {
  return new JSDOM(`<!doctype html><html><body>
    <div class="container posts">
      <div class="post-stream">
        <div id="post_1" class="topic-post"><div class="cooked">OP</div></div>
        <div id="post_2" class="topic-post"><aside class="quote">摘录</aside><div class="cooked">hello</div></div>
        <div id="post_3" class="topic-post"><div class="cooked">world</div></div>
      </div>
    </div>
  </body></html>`);
}

describe("comments dock", () => {
  it("moves posts after OP, is idempotent, and restores them", () => {
    const { window } = topicWithReplies();
    const document = window.document;
    const op = document.querySelector("#post_1");
    assert.equal(postsToDock(document).length, 2);
    ensureTopicShell(document);
    dockComments(document);
    dockComments(document);
    const list = document.querySelector(".wecom-comments-list");
    assert.equal(list.querySelectorAll(".topic-post").length, 2);
    assert.equal(op.parentElement.classList.contains("post-stream"), true);
    assert.equal(document.querySelector(".wecom-comments-empty").hidden, true);
    restoreComments(document);
    assert.equal(document.querySelector(".post-stream").querySelectorAll(".topic-post").length, 3);
  });
});
