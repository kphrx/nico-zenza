import assert from "node:assert/strict";
import {describe, it, mock} from "node:test";

import {Nvapi} from "./";
import type {ErrorResponse} from "../types";

await describe("nvapi v1", async () => {
  const nvapi = new Nvapi().v1;

  await describe("playlist", async () => {
    await describe("watch later", async () => {
      await it("endpoint url", () => {
        assert.equal(
          "https://nvapi.nicovideo.jp/v1/playlist/watch-later",
          nvapi.playlist.watchLater.endpoint.toString(),
        );
      });
    });
  });

  await describe("watch", async () => {
    await describe("access rights", async () => {
      const accessRights = nvapi.watch.accessRights("sm9");

      await describe("hls", async () => {
        await it("endpoint url", () => {
          assert.equal(
            "https://nvapi.nicovideo.jp/v1/watch/sm9/access-rights/hls",
            accessRights.hls.endpoint.toString(),
          );
        });
      });

      await it("request url", async () => {
        const res: ErrorResponse = {
          meta: {status: 404, errorCode: "NOT_FOUND"},
        };

        mock.method(
          globalThis,
          "fetch",
          (...args: Parameters<typeof fetch>): ReturnType<typeof fetch> => {
            const [input] = args;

            assert.equal(
              "https://nvapi.nicovideo.jp/v1/watch/sm9/access-rights/hls?actionTrackId=0_0",
              input instanceof Request ? input.url : input.toString(),
            );

            return Promise.resolve(Response.json(res));
          },
        );

        assert.equal(
          404,
          (
            await accessRights.hls.post({
              params: {actionTrackId: "0_0"},
              accessRightKey: "accessRightKey",
              videos: [],
              audios: [],
            })
          ).meta.status,
        );
      });
    });
  });
});
