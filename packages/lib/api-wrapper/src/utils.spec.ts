import assert from "node:assert/strict";
import {describe, it} from "node:test";

import {mergeHeaders} from "./utils";

await describe("utilities", async () => {
  await it("mergeHeaders", () => {
    const mergedHeaders = mergeHeaders(
      {"x-a-header": "a-header"},
      {"x-b-header": "b-header"},
    );

    assert.equal(mergedHeaders.get("x-a-header"), "a-header");
    assert.equal(mergedHeaders.get("x-b-header"), "b-header");
  });
});
