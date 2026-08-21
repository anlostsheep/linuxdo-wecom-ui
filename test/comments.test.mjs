import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import { postsToDock } from "../wecom-core.mjs";
import { applyTheme, dockComments, ensureTopicShell, restoreComments } from "../wecom-boot.mjs";

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

function topicWithOpOnly() {
  return new JSDOM(`<!doctype html><html><body>
    <div class="container posts">
      <div class="post-stream">
        <div id="post_1" class="topic-post"><div class="cooked">OP</div></div>
      </div>
    </div>
  </body></html>`);
}

describe("comments dock", () => {
  it("moves posts after OP, is idempotent, and restores them", () => {
    const { window } = topicWithReplies();
    const document = window.document;
    const op = document.querySelector("#post_1");
    const post2 = document.querySelector("#post_2");
    const post3 = document.querySelector("#post_3");
    assert.equal(postsToDock(document).length, 2);
    ensureTopicShell(document);
    dockComments(document);
    dockComments(document);
    const stream = document.querySelector(".post-stream");
    const list = document.querySelector(".wecom-comments-list");
    assert.deepEqual([...stream.querySelectorAll(".topic-post")].map((p) => p.id), ["post_1"]);
    assert.deepEqual([...list.querySelectorAll(".topic-post")].map((p) => p.id), ["post_2", "post_3"]);
    assert.equal(list.querySelector("#post_2"), post2);
    assert.equal(list.querySelector("#post_3"), post3);
    assert.equal(post2.querySelector("aside.quote")?.textContent, "摘录");
    assert.equal(op.parentElement.classList.contains("post-stream"), true);
    assert.equal(document.querySelector(".wecom-comments-empty").hidden, true);
    restoreComments(document);
    assert.deepEqual(
      [...document.querySelector(".post-stream").querySelectorAll(".topic-post")].map((p) => p.id),
      ["post_1", "post_2", "post_3"]
    );
    assert.equal(list.querySelectorAll(".topic-post").length, 0);
  });

  it("shows empty state when topic has no replies", () => {
    const { window } = topicWithOpOnly();
    const document = window.document;
    ensureTopicShell(document);
    dockComments(document);
    assert.equal(document.querySelector(".wecom-comments-empty").hidden, false);
  });

  it("does not mix comments when topic path and OP change", () => {
    const { window } = new JSDOM(
      `<!doctype html><html><body>
        <div id="main-outlet">
          <div class="container posts">
            <div class="post-stream">
              <div id="post_1" class="topic-post"><div class="cooked">A-OP</div></div>
              <div id="post_2" class="topic-post"><div class="cooked">A-reply</div></div>
            </div>
          </div>
        </div>
      </body></html>`,
      { url: "https://linux.do/t/a/1" }
    );
    const document = window.document;
    globalThis.location = window.location;
    applyTheme(document, "/* css */");
    const list = document.querySelector(".wecom-comments-list");
    const replyA = list.querySelector("#post_2");
    assert.equal(replyA?.textContent, "A-reply");

    window.history.pushState({}, "", "/t/b/2");
    const stream = document.querySelector(".post-stream");
    stream.replaceChildren();
    const opB = document.createElement("div");
    opB.id = "post_1";
    opB.className = "topic-post";
    opB.innerHTML = '<div class="cooked">B-OP</div>';
    const replyB = document.createElement("div");
    replyB.id = "post_2";
    replyB.className = "topic-post";
    replyB.innerHTML = '<div class="cooked">B-reply</div>';
    stream.append(opB, replyB);

    applyTheme(document, "/* css */");
    assert.equal(list.querySelectorAll(".topic-post").length, 1);
    assert.equal(list.querySelector(".topic-post"), replyB);
    assert.equal(replyB.textContent, "B-reply");
    assert.equal(stream.querySelectorAll(".topic-post").length, 1);
    assert.equal(stream.querySelector("#post_1"), opB);
    assert.equal(replyA.isConnected, false);
    assert.equal(document.documentElement.dataset.wecomTopicPath, "/t/b/2");
  });
});
