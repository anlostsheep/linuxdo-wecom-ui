import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import {
  makeDocIcons,
  makeCreateTopicButton
} from "../wecom-boot.mjs";

function homeDom() {
  return new JSDOM(`<!doctype html><html><body>
    <header class="d-header"><div class="contents"></div></header>
    <div class="sidebar-container"><div class="sidebar-sections"></div></div>
    <div class="navigation-container">
      <button class="create-topic">新建话题</button>
    </div>
    <table class="topic-list">
      <thead class="topic-list-header">
        <tr>
          <th class="main-link"></th>
          <th class="posters"></th>
          <th class="posts"></th>
          <th class="views"></th>
          <th class="activity"></th>
        </tr>
      </thead>
      <tbody>
        <tr class="topic-list-item"><td class="main-link"><span class="link-top-line"><a href="/t/1" class="title">帖子一</a></span></td></tr>
        <tr class="topic-list-item"><td class="main-link"><span class="link-top-line"><a href="/t/2" class="title">帖子二</a></span></td></tr>
      </tbody>
    </table>
  </body></html>`);
}

describe("homepage mounts", () => {
  it("adds one blue doc icon inside title link and styles create button", () => {
    const { window } = homeDom();
    const document = window.document;
    makeDocIcons(document);
    makeDocIcons(document);
    assert.equal(document.querySelectorAll(".wecom-doc-icon").length, 2);
    assert.ok(document.querySelector("a.title .wecom-doc-icon"));
    makeCreateTopicButton(document);
    assert.ok(document.querySelector(".wecom-create-topic"));
  });
});


