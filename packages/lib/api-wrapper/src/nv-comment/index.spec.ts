import assert from "node:assert/strict";
import {describe, it} from "node:test";

import {NvComment} from "./";

await describe("nv-comment v1", async () => {
  const nvComment = new NvComment("https://nv-comment.nicovideo.jp").v1;

  await describe("threads", async () => {
    const threads = nvComment.threads;

    await it("endpoint url", () => {
      assert.equal(
        "https://nv-comment.nicovideo.jp/v1/threads",
        threads.endpoint.toString(),
      );
    });
  });
});
