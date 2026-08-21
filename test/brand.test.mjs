import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import { WECOM_BRAND_SVG } from "../wecom-core.mjs";
import { makeBrand, makeFavicon } from "../wecom-boot.mjs";

describe("brand", () => {
  it("uses the official colorful WeCom mark, not green dual bubbles only", () => {
    assert.match(WECOM_BRAND_SVG, /viewBox="0 0 36 36"/);
    assert.match(WECOM_BRAND_SVG, /#0082EF|#0082ef/i);
    assert.match(WECOM_BRAND_SVG, /#2DBC00|#2dbc00/i);
    assert.match(WECOM_BRAND_SVG, /#FB6500|#fb6500/i);
    assert.doesNotMatch(WECOM_BRAND_SVG, /飞书/);
  });
  it("inserts brand once and writes a svg favicon", () => {
    const { window } = new JSDOM(`<!doctype html><html><head></head>
      <body><header class="d-header"><div class="title"><a href="/"></a></div></header></body></html>`);
    const document = window.document;
    global.XMLSerializer = window.XMLSerializer;
    makeBrand(document);
    makeBrand(document);
    assert.equal(document.querySelectorAll(".wecom-brand").length, 1);
    assert.match(document.querySelector(".wecom-brand").textContent, /企业微信/);
    makeFavicon(document);
    const icon = document.getElementById("wecom-favicon");
    assert.ok(icon);
    assert.match(icon.getAttribute("href"), /^data:image\/svg\+xml/);
  });
  it("does not keep rewriting favicon attributes once set", async () => {
    const { window } = new JSDOM(`<!doctype html><html><head></head>
      <body><header class="d-header"><div class="title"><a href="/"></a></div></header></body></html>`);
    const document = window.document;
    global.XMLSerializer = window.XMLSerializer;
    makeBrand(document);
    makeFavicon(document);
    const href = document.getElementById("wecom-favicon").getAttribute("href");
    for (let i = 0; i < 25; i++) makeFavicon(document);
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(document.querySelectorAll("link[rel~='icon']").length, 1);
    assert.equal(document.getElementById("wecom-favicon").getAttribute("href"), href);
  });
});
