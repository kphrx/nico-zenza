import type {ReactiveController} from "lit";
import type {StatusRenderer} from "@lit/task";
import {initialState, Task} from "@lit/task";

import {isErrorResponse} from "@/nvapi-response";
import type {NVAPIResponse} from "@/nvapi-response";
import type {WatchV3Response} from "@/watch-data";

import type {PlayerDialog} from "./dialog";

type ReactiveControllerHost = PlayerDialog;

export class WatchDataController implements ReactiveController {
  static #trackId() {
    const alnum =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJLKMNOPQRSTUVWXYZ0123456789".split(
        "",
      );
    const id = Array.from(
      {length: 10},
      () => alnum[Math.floor(Math.random() * alnum.length)],
    ).join("");
    return id + "_" + Date.now();
  }

  #host: ReactiveControllerHost;
  #task: Task<[string], WatchV3Response>;

  constructor(host: ReactiveControllerHost) {
    this.#host = host;
    this.#task = new Task<[string], WatchV3Response>(
      host,
      async ([videoId]: [string], {signal}) => {
        if (videoId?.trim() === "") {
          return initialState;
        }

        const url = new URL(`https://www.nicovideo.jp/api/watch/v3/${videoId}`);

        url.searchParams.set("actionTrackId", WatchDataController.#trackId());
        url.searchParams.set("additionals", "series");

        let json: NVAPIResponse<WatchV3Response>;
        try {
          const res = await fetch(url, {
            headers: {"X-Frontend-Id": "6", "X-Frontend-Version": "0"},
            credentials: "include",
            signal,
          });
          json = (await res.json()) as typeof json;
        } catch {
          throw new Error(`Failed to fetch [${videoId}]`);
        }

        if (isErrorResponse(json)) {
          const {meta, data} = json;

          throw new Error(
            `Failed to fetch [${videoId}]: ${meta.status.toString()}: ${meta.errorCode} ${data?.reasonCode ?? ""}`,
          );
        }

        return json.data;
      },
      () => [this.#host.videoId],
    );

    this.#host.addController(this);
  }

  hostUpdate() {}

  render(renderFunctions: StatusRenderer<WatchV3Response>) {
    return this.#task.render(renderFunctions);
  }
}
