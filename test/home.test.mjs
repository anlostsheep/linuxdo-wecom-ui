import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import {
  makeColumnLabels,
  makeDocIcons,
  makeHomeHeading,
  makeSidebarSearch,
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
        <tr class="topic-list-item"><td class="main-link"><span class="link-top-line"></span></td></tr>
        <tr class="topic-list-item"><td class="main-link"><span class="link-top-line"></span></td></tr>
      </tbody>
    </table>
  </body></html>`);
}

describe("homepage mounts", () => {
  it("labels columns, adds one blue doc icon per row, and is idempotent", () => {
    const { window } = homeDom();
    const document = window.document;
    makeColumnLabels(document);
    makeColumnLabels(document);
    assert.equal(document.querySelector("th.main-link .wecom-column-label").textContent, "标题");
    assert.equal(document.querySelectorAll(".wecom-column-label").length, 5);
    makeDocIcons(document);
    makeDocIcons(document);
    assert.equal(document.querySelectorAll(".wecom-doc-icon").length, 2);
    makeHomeHeading(document);
    makeHomeHeading(document);
    assert.equal(document.querySelectorAll(".wecom-home-heading").length, 1);
    makeSidebarSearch(document);
    makeSidebarSearch(document);
    assert.equal(document.querySelectorAll(".wecom-sidebar-search").length, 1);
    makeCreateTopicButton(document);
    assert.ok(document.querySelector(".wecom-create-topic"));
  });
});
