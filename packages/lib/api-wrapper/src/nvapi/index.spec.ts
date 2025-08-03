import assert from "node:assert/strict";
import {describe, it, mock} from "node:test";

import {Nvapi} from "./";
import type {ErrorResponse, FetchFunc} from "../types";

await describe("nvapi v1", async () => {
  const nvapi = new Nvapi().v1;

  await describe("playlist", async () => {
    await describe("series", async () => {
      await it("endpoint url", () => {
        assert.equal(
          nvapi.playlist.series.endpoint.toString(),
          "https://nvapi.nicovideo.jp/v1/playlist/series/",
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
            const [input] = args;

            if (input instanceof Request) {
              assert.fail("not expected");
            }

            assert.equal(
              input.toString(),
              "https://nvapi.nicovideo.jp/v1/playlist/series/74",
            );

            return Promise.resolve(Response.json(res));
          },
        );

        assert.equal(
          (await nvapi.playlist.series.get("74", {params: {}})).meta.status,
          404,
        );
      });
    });

    await describe("channel uploaded", async () => {
      await it("endpoint url", () => {
        assert.equal(
          nvapi.playlist.channelUploaded.endpoint.toString(),
          "https://nvapi.nicovideo.jp/v1/playlist/channel-uploaded/",
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

            if (input instanceof Request) {
              assert.fail("not expected");
            }

            assert.equal(
              input.toString(),
              "https://nvapi.nicovideo.jp/v1/playlist/channel-uploaded/ch1?sortKey=registeredAt&sortOrder=asc",
            );

            return Promise.resolve(Response.json(res));
          },
        );

        assert.equal(
          (
            await nvapi.playlist.channelUploaded.get("ch1", {
              params: {sortKey: "registeredAt", sortOrder: "asc"},
            })
          ).meta.status,
          404,
        );
      });
    });

    await describe("user uploaded", async () => {
      await it("endpoint url", () => {
        assert.equal(
          nvapi.playlist.userUploaded.endpoint.toString(),
          "https://nvapi.nicovideo.jp/v1/playlist/user-uploaded/",
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

            if (input instanceof Request) {
              assert.fail("not expected");
            }

            assert.equal(
              input.toString(),
              "https://nvapi.nicovideo.jp/v1/playlist/user-uploaded/1",
            );

            return Promise.resolve(Response.json(res));
          },
        );

        assert.equal(
          (await nvapi.playlist.userUploaded.get("1", {params: {}})).meta
            .status,
          404,
        );
      });
    });

    await describe("mylist", async () => {
      await it("endpoint url", () => {
        assert.equal(
          nvapi.playlist.mylist.endpoint.toString(),
          "https://nvapi.nicovideo.jp/v1/playlist/mylist/",
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

            if (input instanceof Request) {
              assert.fail("not expected");
            }

            assert.equal(
              input.toString(),
              "https://nvapi.nicovideo.jp/v1/playlist/mylist/26",
            );

            return Promise.resolve(Response.json(res));
          },
        );

        assert.equal(
          (await nvapi.playlist.mylist.get("26", {params: {}})).meta.status,
          404,
        );
      });
    });

    await describe("watch later", async () => {
      await it("endpoint url", () => {
        assert.equal(
          nvapi.playlist.watchLater.endpoint.toString(),
          "https://nvapi.nicovideo.jp/v1/playlist/watch-later",
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
            const [input, init] = args;

            if (input instanceof Request) {
              assert.fail("not expected");
            }

            assert.equal(
              input.toString(),
              "https://nvapi.nicovideo.jp/v1/playlist/watch-later",
            );

            const headers = new Headers(init?.headers);

            assert.equal(headers.get("X-Frontend-Id"), "6");
            assert.equal(headers.get("X-Frontend-Version"), "0");
            assert.equal(headers.get("X-Niconico-Language"), "ja-jp");

            return Promise.resolve(Response.json(res));
          },
        );

        assert.equal(
          (await nvapi.playlist.watchLater.get({params: {}, language: "ja-jp"}))
            .meta.status,
          404,
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
            accessRights.hls.endpoint.toString(),
            "https://nvapi.nicovideo.jp/v1/watch/sm9/access-rights/hls",
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
            const [input, init] = args;

            if (input instanceof Request) {
              assert.fail("not expected");
            }

            assert.equal(
              input.toString(),
              "https://nvapi.nicovideo.jp/v1/watch/sm9/access-rights/hls?actionTrackId=0_0",
            );

            const headers = new Headers(init?.headers);

            assert.equal(headers.get("X-Frontend-Id"), "6");
            assert.equal(headers.get("X-Frontend-Version"), "0");
            assert.equal(headers.get("X-Access-Right-Key"), "accessRightKey");

            assert.equal(
              JSON.stringify({outputs: [["1080p", "192kbps"]]}),
              init?.body,
            );

            return Promise.resolve(Response.json(res));
          },
        );

        assert.equal(
          (
            await accessRights.hls.post({
              params: {actionTrackId: "0_0"},
              accessRightKey: "accessRightKey",
              videos: ["1080p"],
              audios: ["192kbps"],
            })
          ).meta.status,
          404,
        );
      });
    });
  });
});
