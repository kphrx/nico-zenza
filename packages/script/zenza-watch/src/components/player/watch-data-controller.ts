import type {ReactiveController} from "lit";
import type {StatusRenderer} from "@lit/task";
import {initialState, Task} from "@lit/task";

import {isErrorResponse} from "@nico-zenza/api-wrapper";
import type {
  ApiResponseWithStatus,
  VideoId,
  WatchData,
} from "@nico-zenza/api-wrapper";

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

  #isLoggedIn = true;
  #host: ReactiveControllerHost;
  #task: Task<[VideoId | `${number}` | undefined], WatchData>;

  constructor(host: ReactiveControllerHost) {
    this.#host = host;
    this.#task = new Task<[VideoId | `${number}` | undefined], WatchData>(
      host,
      async ([videoId], {signal}) => {
        if (videoId == null) {
          return initialState;
        }

        this.#host.playerMessage.info("動画情報読み込み中", videoId);

        const json = await this.#fetchWatchV3API(
          videoId,
          WatchDataController.#trackId(),
          signal,
        ).catch((e) => {
          this.#host.playerMessage.failure(e, videoId);

          throw e;
        });

        if (isErrorResponse(json)) {
          const {meta, data} = json;

          const error = new Error(
            `Failed to fetch - ${meta.status.toString()}: ${meta.errorCode} ${data?.reasonCode ?? ""}`,
          );
          this.#host.playerMessage.failure(error, videoId);

          throw error;
        }

        this.#host.playerMessage.success("動画情報読み込み完了", videoId);

        return json.data;
      },
      () => [this.#host.videoId],
    );

    this.#host.addController(this);
  }

  #fetchWatchV3API = async (
    videoId: VideoId | `${number}`,
    trackId: string,
    signal: AbortSignal,
  ): Promise<ApiResponseWithStatus<WatchData>> => {
    const url = new URL(
      `https://www.nicovideo.jp/api/watch/${this.#isLoggedIn ? "v3" : "v3_guest"}/${videoId}`,
    );

    url.searchParams.set("actionTrackId", trackId);
    url.searchParams.set("additionals", "series");

    try {
      const res = await fetch(url, {
        headers: {"X-Frontend-Id": "6", "X-Frontend-Version": "0"},
        credentials: this.#isLoggedIn ? "include" : "omit",
        signal,
      });
      const json = (await res.json()) as ApiResponseWithStatus<WatchData>;

      if (
        !isErrorResponse(json) ||
        !this.#isLoggedIn ||
        json.meta.status !== 400 ||
        json.meta.errorCode !== "UNAUTHORIZED"
      ) {
        return json;
      }

      this.#isLoggedIn = false;

      return await this.#fetchWatchV3API(
        videoId,
        WatchDataController.#trackId(),
        signal,
      );
    } catch (e) {
      console.error(e);
      throw new Error("Failed to fetch");
    }
  };

  hostUpdate() {}

  render(renderFunctions: StatusRenderer<WatchData>) {
    return this.#task.render(renderFunctions);
  }
}
