import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import { applyTheme } from "../wecom-boot.mjs";

describe("topic posts stream", () => {
  it("preserves native post-stream structure and order without moving DOM nodes", () => {
    const { window } = new JSDOM(
      `<!doctype html><html><body>
        <div id="main-outlet">
          <div class="container posts">
            <div class="post-stream">
              <div id="post_1" class="topic-post"><div class="cooked">OP</div></div>
              <div id="post_2" class="topic-post"><div class="cooked">Reply 1</div></div>
              <div id="post_3" class="topic-post"><div class="cooked">Reply 2</div></div>
            </div>
          </div>
        </div>
      </body></html>`,
      { url: "https://linux.do/t/topic-demo/123" }
    );
    const document = window.document;
    globalThis.window = window;
    globalThis.location = window.location;
    applyTheme(document, "/* css */");
    const stream = document.querySelector(".post-stream");
    assert.ok(stream);
    const posts = [...stream.querySelectorAll(".topic-post")].map((p) => p.id);
    assert.deepEqual(posts, ["post_1", "post_2", "post_3"]);
    assert.equal(document.querySelectorAll("aside.wecom-comments").length, 0);
  });
});

