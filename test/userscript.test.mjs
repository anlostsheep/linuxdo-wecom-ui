import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const userscript = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../linuxdo-wecom.user.js"),
  "utf8"
);

describe("built userscript", () => {
  it("ships v2.0.0 with WeCom brand and theme bootstrap", () => {
    assert.match(userscript, /@version\s+2\.0\.0/);
    assert.match(userscript, /wecom-doc-theme/);
    assert.match(userscript, /WECOM_BRAND_SVG/);
    assert.match(userscript, /wecom-doc-icon/);
    assert.doesNotMatch(userscript, /disableDiscourseCloaking/);
    assert.doesNotMatch(userscript, /dockComments/);
  });
});

