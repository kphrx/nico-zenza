import type {ReactiveController} from "lit";
import {initialState, Task} from "@lit/task";
import type {StatusRenderer} from "@lit/task";

import {isErrorResponse} from "@/nvapi-response";
import type {NVAPIResponse} from "@/nvapi-response";
import type {WatchV3Response} from "@/watch-data";

import type {PlayerVideo} from "./video";

type ReactiveControllerHost = PlayerVideo;
interface AccessRights {
  contentUrl: string;
  createTime: string;
  expireTime: string;
}

export class SessionController implements ReactiveController {
  #host: ReactiveControllerHost;
  #task: Task<[WatchV3Response | undefined], AccessRights>;

  constructor(host: ReactiveControllerHost) {
    this.#host = host;

    this.#task = new Task<[WatchV3Response | undefined], AccessRights>(
      this.#host,
      async ([watchData]: [WatchV3Response | undefined], {signal}) => {
        if (watchData == null) {
          return initialState;
        }

        const {domand} = watchData.media;
        if (domand == null) {
          throw new Error("Not supported non domand video");
        }

        let json: NVAPIResponse<AccessRights>;
        try {
          const url = new URL(
            `/v1/watch/${watchData.client.watchId}/access-rights/hls`,
            "https://nvapi.nicovideo.jp/",
          );
          url.searchParams.set("actionTrackId", watchData.client.watchTrackId);
          const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
              outputs: domand.videos
                .filter((video) => video.isAvailable)
                .map((video) => [
                  video.id,
                  domand.audios.filter((audio) => audio.isAvailable)[0].id,
                ]),
            }),
            headers: {
              "X-Frontend-Id": "6",
              "X-Frontend-Version": "0",
              "X-Request-With": "https://www.nicovideo.jp",
              "Content-Type": "application/json",
              "X-Access-Right-Key": domand.accessRightKey,
            },
            credentials: "include",
            signal,
          });
          json = (await res.json()) as typeof json;
        } catch {
          throw new Error(
            `Failed to fetch comments [${watchData.client.watchId}]`,
          );
        }

        if (isErrorResponse(json)) {
          const {meta, data} = json;

          throw new Error(
            `Failed to right access hls [${watchData.client.watchId}]: ${meta.status.toString()}: ${meta.errorCode} ${data?.reasonCode ?? ""}`,
          );
        }

        return json.data;
      },
      () => [this.#host.watchData],
    );

    this.#host.addController(this);
  }

  hostUpdate() {}

  render(renderFunctions: StatusRenderer<AccessRights>) {
    return this.#task.render(renderFunctions);
  }
}
