import assert from "node:assert/strict";
import {describe, it} from "node:test";

import {Nvapi} from "./";

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
    });
  });
});
