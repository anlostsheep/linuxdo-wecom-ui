import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
});



