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
  it("uses Primer soft dark canvas, not WeCom near-black", () => {
    assert.match(css, /html\.wecom-doc-theme\.wecom-dark/);
    assert.match(css, /#212830/);
    assert.match(css, /#d1d7e0/);
    assert.match(css, /#9198a1/);
    assert.doesNotMatch(css, /#17171a/);
    assert.doesNotMatch(css, /内部使用/);
  });
  it("keeps WeCom teal accent and blue doc icon", () => {
    assert.match(css, /#12b3a8/);
    assert.match(css, /#4b8cff/);
    assert.match(css, /#3dcdc4/);
  });
  it("uses a single-row three-column shell with a doc-main cell", () => {
    assert.match(css, /\.wecom-shell\s*\{[^}]*grid-template-rows:\s*minmax\(0,\s*1fr\)/);
    assert.match(css, /\.wecom-shell\s*>\s*\.wecom-doc-main/);
    assert.match(css, /\.wecom-shell\s*>\s*aside\.wecom-toc\s*\{[^}]*grid-column:\s*1/);
    assert.match(css, /\.wecom-shell\s*>\s*aside\.wecom-comments\s*\{[^}]*grid-column:\s*3/);
  });
});
