import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const css = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../wecom-style.css"),
  "utf8"
);

describe("wecom-style tokens and layout", () => {
  it("uses Primer soft dark canvas (#212830) with WeCom blue accent", () => {
    assert.match(css, /html\.wecom-doc-theme\.wecom-dark/);
    assert.match(css, /#212830/);
    assert.match(css, /#d1d7e0/);
    assert.match(css, /#9198a1/);
    assert.match(css, /#1f7eff/);
    assert.match(css, /#388bff/);
    assert.match(css, /var\(--wecom-doc\)|#4b8cff/);
    assert.doesNotMatch(css, /内部使用/);
  });
  it("styles sidebar, topic document, and native timeline layout cleanly", () => {
    assert.match(css, /\.sidebar-wrapper/);
    assert.match(css, /\.sidebar-section-link/);
    assert.match(css, /#topic-title/);
    assert.match(css, /\.timeline-container/);
    assert.match(css, /aside\.wecom-toc/);
    assert.doesNotMatch(css, /\.wecom-shell/);
    assert.doesNotMatch(css, /aside\.wecom-comments/);
    assert.doesNotMatch(css, /\.wecom-toc-level-3/);
  });
  it("restyles the OP topic-map as a compact document footer", () => {
    assert.match(css, /\.post__topic-map|\.topic-map\.--op/);
    assert.match(css, /\.topic-map__stats/);
    assert.match(css, /\.topic-map__users-list/);
    assert.match(css, /\.topic-map__links-trigger/);
    assert.match(css, /content:\s*["']评论["']/);
    assert.match(css, /\.topic-post:has\(#post_1\)::after/);
    assert.match(css, /\.topic-post:has\(#post_1\)/);
    assert.match(css, /\.topic-post:not\(:has\(#post_1\)\)/);
    assert.doesNotMatch(css, /\.topic-post:first-child\s*\{/);
    assert.doesNotMatch(css, /\.topic-post:not\(:first-child\)/);
    assert.doesNotMatch(css, /\.topic-post:has\(#post_1\)\s*\+\s*\.topic-post::before/);
    assert.doesNotMatch(
      css,
      /html\.wecom-doc-topic \.topic-map,\s*\nhtml\.wecom-doc-topic \.post__topic-map \{\s*display:\s*none/
    );
  });
  it("does not hide the OP wrapper that Discourse marks as topic-owner", () => {
    const { window } = new JSDOM(
      `<!doctype html><html class="wecom-doc-theme wecom-doc-topic">
        <head><style>${css}</style></head>
        <body>
          <div class="post-stream">
            <div class="topic-post clearfix post--topic-owner topic-owner">
              <article id="post_1"><div class="cooked">OP body</div></article>
            </div>
            <span class="post-info owner">楼主</span>
          </div>
        </body>
      </html>`
    );
    const op = window.document.querySelector(".topic-post.topic-owner");
    const badge = window.document.querySelector(".post-info.owner");
    assert.notEqual(window.getComputedStyle(op).display, "none");
    assert.equal(window.getComputedStyle(badge).display, "none");
  });

  it("drops the linux.do TOPIC OWNER pseudo badge without hiding owner posts", () => {
    assert.match(
      css,
      /html\.wecom-doc-topic \.topic-post\.topic-owner \.cooked::after \{\s*content:\s*none !important;/
    );
    const { window } = new JSDOM(
      `<!doctype html><html class="wecom-doc-theme wecom-doc-topic">
        <head><style>${css}</style></head>
        <body><div class="topic-post topic-owner"><article id="post_3"><div class="cooked">reply</div></article></div></body>
      </html>`
    );
    const cooked = window.document.querySelector(".cooked");
    assert.notEqual(window.getComputedStyle(cooked).display, "none");
  });

  it("shows one header title on topics: hides Discourse extra-info, puts crumbs after the brand", () => {
    const { window } = new JSDOM(
      `<!doctype html><html class="wecom-doc-theme wecom-doc-topic">
        <head><style>${css}</style></head>
        <body><header class="d-header"><div class="contents">
          <span class="header-sidebar-toggle"></span>
          <div class="home-logo-wrapper-outlet"></div>
          <div class="two-rows extra-info-wrapper"><h1 class="header-title">t</h1></div>
          <div class="panel"></div>
          <div class="wecom-topic-context">知识库 › t</div>
        </div></header></body>
      </html>`
    );
    const q = (s) => window.getComputedStyle(window.document.querySelector(s));
    assert.equal(q(".extra-info-wrapper").display, "none");
    assert.equal(q(".home-logo-wrapper-outlet").order, "-2");
    assert.equal(q(".wecom-topic-context").order, "-1");
    assert.equal(q(".wecom-topic-context").marginRight, "auto");
  });

  it("keeps OP topic-map views and likes on one horizontal line", () => {
    const { window } = new JSDOM(
      `<!doctype html><html class="wecom-doc-theme wecom-doc-topic">
        <head>
          <style>
            .topic-map__stats > .btn {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .topic-map__stats > .btn .number,
            .topic-map__stats > .btn .topic-map__stat-label { display: block; }
          </style>
          <style>${css}</style>
        </head>
        <body>
          <div class="post__topic-map topic-map --op">
            <section class="topic-map__contents">
              <div class="topic-map__stats --many-stats">
                <button class="btn no-text topic-map__views-trigger">
                  <span class="number">469</span>
                  <span class="topic-map__stat-label">浏览量</span>
                </button>
                <button class="btn no-text topic-map__likes-trigger">
                  <span class="number">11</span>
                  <span class="topic-map__stat-label">赞</span>
                </button>
                <button class="btn no-text topic-map__links-trigger">
                  <span class="number">50+</span>
                  <span class="topic-map__stat-label">链接</span>
                </button>
                <button class="btn no-text topic-map__users-trigger">
                  <span class="number">4.0k</span>
                  <span class="topic-map__stat-label">用户</span>
                </button>
              </div>
            </section>
          </div>
        </body>
      </html>`
    );
    const views = window.document.querySelector(".topic-map__views-trigger");
    const likes = window.document.querySelector(".topic-map__likes-trigger");
    const number = views.querySelector(".number");
    const label = views.querySelector(".topic-map__stat-label");
    assert.equal(window.getComputedStyle(views).flexDirection, "row");
    assert.equal(window.getComputedStyle(likes).flexDirection, "row");
    assert.equal(window.getComputedStyle(views).alignItems, "baseline");
    assert.notEqual(window.getComputedStyle(number).display, "block");
    assert.notEqual(window.getComputedStyle(label).display, "block");
    assert.equal(
      window.getComputedStyle(window.document.querySelector(".topic-map__links-trigger")).display,
      "none"
    );
    assert.equal(
      window.getComputedStyle(window.document.querySelector(".topic-map__users-trigger")).display,
      "none"
    );
    assert.match(css, /\.topic-map__stats\s*>\s*\.topic-map__links-trigger/);
    assert.match(css, /\.topic-map__stats\s*>\s*\.topic-map__users-trigger/);
  });

  it("keeps homepage poster avatars on one row instead of wrapping the fifth", () => {
    assert.match(css, /\.topic-list\s+\.posters\s+\{[^}]*white-space:\s*nowrap/);
    assert.match(css, /\.topic-list\s+\.posters\s+a\s+\{[^}]*float:\s*none/);
    assert.doesNotMatch(css, /\.topic-list\s+\.posters\s+\{[^}]*max-width:\s*90px/);
  });
});




