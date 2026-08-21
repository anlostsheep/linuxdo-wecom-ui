import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import { TOPIC_CLASS } from "../wecom-core.mjs";
import { bindNavDrawer, ensureTopicShell, makeTopicContext } from "../wecom-boot.mjs";

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

    const toc = document.querySelector("aside.wecom-toc");
    const posts = document.querySelector(".container.posts");
    const comments = document.querySelector("aside.wecom-comments");
    const outlet = document.getElementById("main-outlet");
    const main = document.querySelector(".wecom-doc-main");
    const title = document.getElementById("topic-title");
    assert.ok(main);
    assert.equal(main.parentElement, outlet);
    assert.equal(title.parentElement, main);
    assert.equal(posts.parentElement, main);
    assert.equal(toc.parentElement, outlet);
    assert.equal(comments.parentElement, outlet);
    assert.equal(toc.nextElementSibling, main);
    assert.equal(main.nextElementSibling, comments);
  });

  it("re-parents asides onto #main-outlet after .container.posts appears", () => {
    const { window } = new JSDOM(`<!doctype html><html><body>
      <div id="main-outlet-wrapper">
        <div id="main-outlet"></div>
      </div>
    </body></html>`);
    const document = window.document;
    const wrapper = document.getElementById("main-outlet-wrapper");
    const outlet = document.getElementById("main-outlet");
    ensureTopicShell(document);
    const toc = document.querySelector("aside.wecom-toc");
    const comments = document.querySelector("aside.wecom-comments");
    assert.equal(toc.parentElement, wrapper);
    assert.equal(comments.parentElement, wrapper);

    const extra = document.createElement("div");
    extra.className = "extra-outlet-child";
    outlet.appendChild(extra);
    const posts = document.createElement("div");
    posts.className = "container posts";
    outlet.appendChild(posts);
    const after = document.createElement("div");
    after.className = "after-posts";
    outlet.appendChild(after);

    ensureTopicShell(document);
    const main = document.querySelector(".wecom-doc-main");
    assert.ok(main);
    assert.equal(main.parentElement, outlet);
    assert.equal(posts.parentElement, main);
    assert.equal(toc.parentElement, outlet);
    assert.equal(comments.parentElement, outlet);
    assert.equal(toc.nextElementSibling, main);
    assert.equal(main.nextElementSibling, comments);
    assert.equal(document.querySelectorAll("aside.wecom-toc").length, 1);
    assert.equal(document.querySelectorAll("aside.wecom-comments").length, 1);
  });

  it("binds nav drawer via delegation before hamburger exists", () => {
    const { window } = new JSDOM(`<!doctype html><html class="${TOPIC_CLASS}"><body>
      <header class="d-header"><div class="contents">
        <div class="header-sidebar-toggle"></div>
      </div></header>
    </body></html>`, { url: "https://linux.do/t/x/1" });
    const document = window.document;
    const html = document.documentElement;
    bindNavDrawer(document);
    bindNavDrawer(document);
    assert.equal(html.dataset.wecomNavBound, "1");
    const button = document.createElement("button");
    document.querySelector(".header-sidebar-toggle").appendChild(button);
    button.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    assert.equal(html.classList.contains("wecom-nav-open"), true);
    button.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    assert.equal(html.classList.contains("wecom-nav-open"), false);
  });
});
