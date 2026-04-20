import assert from "node:assert/strict";
import {describe, it} from "node:test";

import {Session} from "./session";

await describe("gate session", async () => {
  await it("notify", async () => {
    const session = new Session("fetch");
    const res = {name: "session notify test"};
    session.notify(Response.json(res));
    assert.deepEqual(await session.promise.then((res) => res.json()), res);
  });

  await it("abort", async () => {
    const session = new Session("fetch");
    const errorMsg = "session abort test";
    session.abort(Error(errorMsg));
    await assert.rejects(session.promise, Error(errorMsg));
  });

  await it("abort signal", async () => {
    const abortController = new AbortController();
    const session = new Session("fetch", abortController.signal);
    const errorMsg = "session abort signal test";
    abortController.abort(Error(errorMsg));
    await assert.rejects(session.promise, Error(errorMsg));
  });
});
