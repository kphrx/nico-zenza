import type {ReactiveController} from "lit";
import {initialState, Task} from "@lit/task";
import type {StatusRenderer} from "@lit/task";

import {isErrorResponse} from "@/nvapi-response";
import type {NVAPIResponse} from "@/nvapi-response";
import type {WatchV3Response} from "@/watch-data";
import type {Threads, FlattedComment} from "@/comment-list";

import type {PlayerInfoPanelCommentsTab} from "./comments";

type ReactiveControllerHost = PlayerInfoPanelCommentsTab;

export class CommentsController implements ReactiveController {
  #host: ReactiveControllerHost;
  #task: Task<[WatchV3Response | undefined], FlattedComment[]>;

  constructor(host: ReactiveControllerHost) {
    this.#host = host;

    this.#task = new Task<[WatchV3Response | undefined], FlattedComment[]>(
      this.#host,
      async ([watchData]: [WatchV3Response | undefined], {signal}) => {
        if (watchData == null) {
          return initialState;
        }

        const nvComment = watchData.comment.nvComment;

        this.#host.playerMessage.info("コメント読み込み中", watchData.video.id);

        let json: NVAPIResponse<Threads>;
        try {
          const res = await fetch(new URL("/v1/threads", nvComment.server), {
            method: "POST",
            body: JSON.stringify({
              additionals: {},
              params: nvComment.params,
              threadKey: nvComment.threadKey,
            }),
            headers: {"X-Frontend-Id": "6", "X-Frontend-Version": "0"},
            signal,
          });
          json = (await res.json()) as typeof json;
        } catch {
          const error = new Error(
            `Failed to fetch comments [${nvComment.params.targets[0]?.id ?? "unknown"}]`,
          );
          this.#host.playerMessage.failure(error, watchData.video.id);

          throw error;
        }

        if (isErrorResponse(json)) {
          const {meta, data} = json;

          const error = new Error(
            `Failed to fetch comments [${nvComment.params.targets[0]?.id ?? "unknown"}]: ${meta.status.toString()}: ${meta.errorCode} ${data?.reasonCode ?? ""}`,
          );
          this.#host.playerMessage.failure(error, watchData.video.id);

          throw error;
        }

        const data = json.data.threads.reduce((prev, thread) => {
          prev.push(
            ...thread.comments.map((comment) => {
              return {
                ...comment,
                postedAt: new Date(comment.postedAt).getTime(),
                fork: thread.fork,
                threadId: thread.id,
              };
            }),
          );
          return prev;
        }, [] as FlattedComment[]);

        this.#host.playerMessage.success(
          "コメント読み込み完了",
          watchData.video.id,
        );

        return data;
      },
      () => [this.#host.watchData],
    );

    this.#host.addController(this);
  }

  hostUpdate() {}

  render(renderFunctions: StatusRenderer<FlattedComment[]>) {
    return this.#task.render(renderFunctions);
  }
}
