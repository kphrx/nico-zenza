import assert from "node:assert/strict";
import {describe, it} from "node:test";

import {Nvapi} from "./";

await describe("nvapi", async () => {
  const nvapi = new Nvapi();

  await describe("playlist", async () => {
    await describe("watch later", async () => {
      await it("endpoint url", () => {
        assert.equal(
          "https://nvapi.nicovideo.jp/v1/playlist/watch-later",
          nvapi.v1.playlist.watchLater.endpoint.toString(),
        );
      });
    });
  });
});
