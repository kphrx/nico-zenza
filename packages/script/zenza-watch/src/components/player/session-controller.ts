import type {ReactiveController} from "lit";
import {initialState, Task} from "@lit/task";
import type {StatusRenderer} from "@lit/task";

import {isErrorResponse, Nvapi} from "@nico-zenza/api-wrapper";
import type {NvapiResponse} from "@nico-zenza/api-wrapper";
import type {WatchV3Response} from "@/watch-data";

import type {PlayerVideo} from "./video";

type ReactiveControllerHost = PlayerVideo;
interface AccessRights {
  contentUrl: string;
  createTime: string;
  expireTime: string;
}

const nvapi = new Nvapi();

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

        this.#host.playerMessage.info(
          "動画セッション開始中",
          watchData.video.id,
        );

        const {domand} = watchData.media;
        if (domand == null) {
          const error = new Error("Not supported non domand video");
          this.#host.playerMessage.failure(error, watchData.video.id);

          throw error;
        }

        const client = nvapi.v1.watch.accessRights(
          watchData.client.watchId,
        ).hls;
        let json: NvapiResponse<AccessRights>;
        try {
          json = await client.post(
            {
              accessRightKey: domand.accessRightKey,
              videos: domand.videos
                .filter((x) => x.isAvailable)
                .map((x) => x.id),
              audios: domand.audios
                .filter((x) => x.isAvailable)
                .map((x) => x.id),
              params: {actionTrackId: watchData.client.watchTrackId},
            },
            {
              credentials: "include",
              signal,
            },
          );
        } catch {
          const error = new Error(`Failed to fetch comments`);
          this.#host.playerMessage.failure(error, watchData.video.id);

          throw error;
        }

        if (isErrorResponse(json)) {
          const {meta, data} = json;

          const error = new Error(
            `Failed to right access hls: ${meta.status.toString()}: ${meta.errorCode} ${data?.reasonCode ?? ""}`,
          );
          this.#host.playerMessage.failure(error, watchData.video.id);

          throw error;
        }

        this.#host.playerMessage.success(
          "動画セッション開始",
          watchData.video.id,
        );

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
