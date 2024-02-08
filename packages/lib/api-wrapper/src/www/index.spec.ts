import assert from "node:assert/strict";
import {describe, it} from "node:test";

import {WwwApi} from "./";

await describe("watch api", async () => {
  const watch = new WwwApi().watch;

  await describe("v3", async () => {
    const v3 = watch.v3("sm9");
    const v3Guest = watch.v3Guest("sm9");

    await it("endpoint url", () => {
      assert.equal(
        "https://www.nicovideo.jp/api/watch/v3/sm9",
        v3.endpoint.toString(),
      );
    });

    await it("guest endpoint url", () => {
      assert.equal(
        "https://www.nicovideo.jp/api/watch/v3_guest/sm9",
        v3Guest.endpoint.toString(),
      );
    });
  });
});
