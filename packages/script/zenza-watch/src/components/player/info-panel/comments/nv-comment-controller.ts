import type {ReactiveController} from "lit";
import {initialState, Task} from "@lit/task";
import type {StatusRenderer} from "@lit/task";

import {isErrorResponse, NvComment} from "@nico-zenza/api-wrapper";
import type {WatchData} from "@nico-zenza/api-wrapper";
import type {FlattedComment} from "@/comment-list";

import type {PlayerInfoPanelCommentsTab} from "./";

type ReactiveControllerHost = PlayerInfoPanelCommentsTab;

export class NVCommentController implements ReactiveController {
  #host: ReactiveControllerHost;
  #task: Task<[WatchData | undefined], FlattedComment[]>;

  constructor(host: ReactiveControllerHost) {
    this.#host = host;

    this.#task = new Task<[WatchData | undefined], FlattedComment[]>(
      this.#host,
      async ([watchData], {signal}) => {
        if (watchData == null) {
          return initialState;
        }

        const nvComment = watchData.comment.nvComment;

        this.#host.playerMessage.info("コメント読み込み中", watchData.video.id);

        const json = await new NvComment(nvComment.server).v1.threads
          .post(
            {
              body: {
                additionals: {},
                params: nvComment.params,
                threadKey: nvComment.threadKey,
              },
            },
            {signal},
          )
          .catch(() => {
            const error = new Error(
              `Failed to fetch comments [${nvComment.params.targets[0]?.id ?? "unknown"}]`,
            );
            this.#host.playerMessage.failure(error, watchData.video.id);

            throw error;
          });

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
