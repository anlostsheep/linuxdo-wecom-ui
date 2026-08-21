import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const css = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../wecom-style.css"),
  "utf8"
);

describe("wecom-style tokens", () => {
  it("uses WeCom smart doc dark canvas", () => {
    assert.match(css, /html\.wecom-doc-theme\.wecom-dark/);
    assert.match(css, /#191b1f/);
    assert.match(css, /#e6e8eb/);
    assert.match(css, /#9a9ea6/);
    assert.doesNotMatch(css, /内部使用/);
  });
  it("keeps WeCom smart doc blue accent, callout card, and doc icon", () => {
    assert.match(css, /#1f7eff/);
    assert.match(css, /var\(--wecom-doc\)|#4b8cff/);
    assert.match(css, /#388bff/);
    assert.match(css, /--wecom-callout-bg/);
  });
  it("styles sidebar and topic header without brittle shell hacks", () => {
    assert.match(css, /\.sidebar-wrapper/);
    assert.match(css, /\.sidebar-section-link/);
    assert.match(css, /#topic-title/);
    assert.doesNotMatch(css, /\.wecom-shell/);
    assert.doesNotMatch(css, /aside\.wecom-toc/);
    assert.doesNotMatch(css, /aside\.wecom-comments/);
  });
});


