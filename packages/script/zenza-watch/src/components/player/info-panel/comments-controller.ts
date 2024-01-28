import type {ReactiveController} from "lit";
import {initialState, Task} from "@lit/task";
import type {StatusRenderer} from "@lit/task";

import {isErrorResponse} from "@/nvapi-response";
import type {NVAPIResponse} from "@/nvapi-response";
import type {NVComment} from "@/watch-data";
import type {Threads, FlattedComment} from "@/comment-list";

import type {PlayerInfoPanelCommentsTab} from "./comments";

type ReactiveControllerHost = PlayerInfoPanelCommentsTab;

export class CommentsController implements ReactiveController {
  #host: ReactiveControllerHost;
  #task: Task<[NVComment | undefined], FlattedComment[]>;

  constructor(host: ReactiveControllerHost) {
    this.#host = host;

    this.#task = new Task<[NVComment | undefined], FlattedComment[]>(
      this.#host,
      async ([nvComment]: [NVComment | undefined], {signal}) => {
        if (nvComment == null) {
          return initialState;
        }

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
          throw new Error(
            `Failed to fetch comments [${nvComment.params.targets[0]?.id ?? "unknown"}]`,
          );
        }

        if (isErrorResponse(json)) {
          const {meta, data} = json;

          throw Error(
            `Failed to fetch comments [${nvComment.params.targets[0]?.id ?? "unknown"}]: ${meta.status.toString()}: ${meta.errorCode} ${data?.reasonCode ?? ""}`,
          );
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

        return data;
      },
      () => [this.#host.nvComment],
    );

    this.#host.addController(this);
  }

  hostUpdate() {}

  render(renderFunctions: StatusRenderer<FlattedComment[]>) {
    return this.#task.render(renderFunctions);
  }
}
