import assert from "node:assert/strict";
import {describe, it, mock} from "node:test";
import type {ErrorResponse, FetchFunc} from "../types";

import {NvComment} from "./";

await describe("nv-comment v1", async () => {
  const nvComment = new NvComment("https://nv-comment.nicovideo.jp").v1;

  await describe("threads", async () => {
    const threads = nvComment.threads;

    await it("endpoint url", () => {
      assert.equal(
        threads.endpoint.toString(),
        "https://nv-comment.nicovideo.jp/v1/threads",
      );
    });

    await it("request url", async () => {
      const res: ErrorResponse = {
        meta: {status: 404, errorCode: "NOT_FOUND"},
      };

      mock.method(
        globalThis,
        "fetch",
        (...args: Parameters<FetchFunc>): ReturnType<FetchFunc> => {
          const [input, init] = args;

          if (input instanceof Request) {
            assert.fail("not expected");
          }

          assert.equal(
            init?.body,
            JSON.stringify({
              additionals: {},
              params: {language: "", targets: []},
              threadKey: "",
            }),
          );

          return Promise.resolve(Response.json(res));
        },
      );

      assert.equal(
        (
          await threads.post({
            body: {
              additionals: {},
              params: {language: "", targets: []},
              threadKey: "",
            },
          })
        ).meta.status,
        404,
      );
    });
  });
});
