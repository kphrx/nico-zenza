import assert from "node:assert/strict";
import {describe, it, mock} from "node:test";

import {WwwApi} from "./";
import type {ErrorResponse} from "../types";

await describe("watch api", async () => {
  const watch = new WwwApi().watch;

  await describe("v3", async () => {
    const v3 = watch.v3("sm9");

    await it("endpoint url", () => {
      assert.equal(
        "https://www.nicovideo.jp/api/watch/v3/sm9",
        v3.endpoint.toString(),
      );
    });
  });

  await describe("v3 guest", async () => {
    const v3Guest = watch.v3Guest("sm9");

    await it("endpoint url", () => {
      assert.equal(
        "https://www.nicovideo.jp/api/watch/v3_guest/sm9",
        v3Guest.endpoint.toString(),
      );
    });

    await it("request url", async () => {
      const res: ErrorResponse = {meta: {status: 404, errorCode: "NOT_FOUND"}};

      mock.method(
        globalThis,
        "fetch",
        (...args: Parameters<typeof fetch>): ReturnType<typeof fetch> => {
          const [input] = args;

          assert.equal(
            "https://www.nicovideo.jp/api/watch/v3_guest/sm9?actionTrackId=0_0",
            input instanceof Request ? input.url : input.toString(),
          );

          return Promise.resolve(Response.json(res));
        },
      );

      assert.equal(
        404,
        (await v3Guest.get({params: {actionTrackId: "0_0"}})).meta.status,
      );
    });
  });
});
