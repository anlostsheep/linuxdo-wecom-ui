import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import {
  isTopicPath,
  isDarkFromScheme,
  applyPageMode,
  applyColorMode,
  topicTitleFromDocumentTitle,
  topicContextText,
  THEME_CLASS,
  HOME_CLASS,
  TOPIC_CLASS,
  DARK_CLASS
} from "../wecom-core.mjs";

describe("isTopicPath", () => {
  it("treats /t/ slugs as topics", () => {
    assert.equal(isTopicPath("/t/hello/123"), true);
  });
  it("treats home and category lists as not topics", () => {
    assert.equal(isTopicPath("/"), false);
    assert.equal(isTopicPath("/c/42"), false);
  });
});

describe("isDarkFromScheme", () => {
  it("is light when the dark-scheme link is missing", () => {
    assert.equal(isDarkFromScheme(null, true), false);
  });
  it("is dark when media is all", () => {
    assert.equal(isDarkFromScheme("all", false), true);
  });
  it("is light when media is none", () => {
    assert.equal(isDarkFromScheme("none", true), false);
  });
  it("follows prefers-color-scheme otherwise", () => {
    assert.equal(isDarkFromScheme("not all and (prefers-color-scheme: light)", true), true);
    assert.equal(isDarkFromScheme("not all and (prefers-color-scheme: light)", false), false);
  });
});

describe("applyPageMode / applyColorMode", () => {
  it("toggles home vs topic and wecom-dark", () => {
    const { window } = new JSDOM("<!doctype html><html><body></body></html>");
    const html = window.document.documentElement;
    const body = window.document.body;
    html.classList.add(THEME_CLASS);
    assert.equal(applyPageMode(html, body, "/t/x/1"), "topic");
    assert.equal(html.classList.contains(TOPIC_CLASS), true);
    assert.equal(html.classList.contains(HOME_CLASS), false);
    assert.equal(applyPageMode(html, body, "/"), "home");
    applyColorMode(html, true);
    assert.equal(html.classList.contains(DARK_CLASS), true);
    applyColorMode(html, false);
    assert.equal(html.classList.contains(DARK_CLASS), false);
  });
});

describe("topic copy", () => {
  it("strips the Linux DO suffix", () => {
    assert.equal(topicTitleFromDocumentTitle("前端知识库 - Linux DO"), "前端知识库");
  });
  it("builds crumbs and falls back category to 知识库", () => {
    assert.equal(topicContextText("前端", "前端知识库"), "知识库 › 前端 › 前端知识库");
    assert.equal(topicContextText(null, "前端知识库"), "知识库 › 知识库 › 前端知识库");
  });
});

describe("OP and TOC extraction", () => {
  it("finds OP post and extracts TOC headings with level and id", async () => {
    const { findOpPost, collectTocEntries } = await import("../wecom-core.mjs");
    const { window } = new JSDOM(`<!doctype html><html><body>
      <div class="post-stream">
        <div id="post_1" class="topic-post">
          <div class="cooked">
            <h1>章节 1</h1>
            <h2>子节 1.1</h2>
            <h3>要点 1.1.1</h3>
          </div>
        </div>
        <div id="post_2" class="topic-post">
          <div class="cooked">
            <h2>评论里的二级标题（不应被提取）</h2>
          </div>
        </div>
      </div>
    </body></html>`);
    const op = findOpPost(window.document);
    assert.ok(op);
    assert.equal(op.id, "post_1");
    const entries = collectTocEntries(op);
    assert.equal(entries.length, 3);
    assert.equal(entries[0].text, "章节 1");
    assert.equal(entries[0].level, 1);
    assert.equal(entries[1].text, "子节 1.1");
    assert.equal(entries[1].level, 2);
    assert.equal(entries[2].text, "要点 1.1.1");
    assert.equal(entries[2].level, 3);
  });
});
