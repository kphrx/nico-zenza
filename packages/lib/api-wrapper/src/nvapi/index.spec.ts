import assert from "node:assert/strict";
import {describe, it, mock} from "node:test";

import {Nvapi} from "./";
import type {ErrorResponse} from "../types";

await describe("nvapi v1", async () => {
  const nvapi = new Nvapi().v1;

  await describe("playlist", async () => {
    await describe("series", async () => {
      await it("endpoint url", () => {
        assert.equal(
          "https://nvapi.nicovideo.jp/v1/playlist/series/",
          nvapi.playlist.series.endpoint.toString(),
        );
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
              "https://nvapi.nicovideo.jp/v1/playlist/series/74",
              input instanceof Request ? input.url : input.toString(),
            );

            return Promise.resolve(Response.json(res));
          },
        );

        assert.equal(
          404,
          (await nvapi.playlist.series.get("74", {params: {}})).meta.status,
        );
      });
    });

    await describe("channel uploaded", async () => {
      await it("endpoint url", () => {
        assert.equal(
          "https://nvapi.nicovideo.jp/v1/playlist/channel-uploaded/",
          nvapi.playlist.channelUploaded.endpoint.toString(),
        );
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
              "https://nvapi.nicovideo.jp/v1/playlist/channel-uploaded/ch1?sortKey=registeredAt&sortOrder=asc",
              input instanceof Request ? input.url : input.toString(),
            );

            return Promise.resolve(Response.json(res));
          },
        );

        assert.equal(
          404,
          (
            await nvapi.playlist.channelUploaded.get("ch1", {
              params: {sortKey: "registeredAt", sortOrder: "asc"},
            })
          ).meta.status,
        );
      });
    });

    await describe("user uploaded", async () => {
      await it("endpoint url", () => {
        assert.equal(
          "https://nvapi.nicovideo.jp/v1/playlist/user-uploaded/",
          nvapi.playlist.userUploaded.endpoint.toString(),
        );
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
              "https://nvapi.nicovideo.jp/v1/playlist/user-uploaded/1",
              input instanceof Request ? input.url : input.toString(),
            );

            return Promise.resolve(Response.json(res));
          },
        );

        assert.equal(
          404,
          (await nvapi.playlist.userUploaded.get("1", {params: {}})).meta
            .status,
        );
      });
    });

    await describe("mylist", async () => {
      await it("endpoint url", () => {
        assert.equal(
          "https://nvapi.nicovideo.jp/v1/playlist/mylist/",
          nvapi.playlist.mylist.endpoint.toString(),
        );
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
              "https://nvapi.nicovideo.jp/v1/playlist/mylist/26",
              input instanceof Request ? input.url : input.toString(),
            );

            return Promise.resolve(Response.json(res));
          },
        );

        assert.equal(
          404,
          (await nvapi.playlist.mylist.get("26", {params: {}})).meta.status,
        );
      });
    });

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
