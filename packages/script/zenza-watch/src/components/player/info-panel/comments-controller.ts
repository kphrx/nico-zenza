import type {ReactiveController} from "lit";
import {initialState, Task} from "@lit/task";
import type {StatusRenderer} from "@lit/task";

import {isErrorResponse} from "@/nvapi-response";
import type {NVAPIResponse} from "@/nvapi-response";
import type {NVComment} from "@/watch-data";
import type {Threads, FlattedComment} from "@/comment-list";

import type {PlayerInfoPanelCommentsTab} from "./comments";

type ReactiveControllerHost = PlayerInfoPanelCommentsTab;
type CommentCompare = (a: FlattedComment, b: FlattedComment) => number;

const EMPTY_ARRAY = new Array<FlattedComment>();

export class CommentsController implements ReactiveController {
  static #sortComments(
    key: "postedAt" | "vposMs" | "nicoruCount",
    desc: boolean = false,
  ): CommentCompare {
    const compare: CommentCompare = (a, b) => {
      if (a[key] > b[key]) {
        return 1;
      }
      if (a[key] < b[key]) {
        return -1;
      }
      return 0;
    };
    return desc ? (a, b) => compare(b, a) : compare;
  }

  #posCompare = CommentsController.#sortComments("vposMs");
  #dateCompare = CommentsController.#sortComments("postedAt", true);
  #nicoruCompare = CommentsController.#sortComments("nicoruCount", true);

  order: "vpos" | "date" | "nicoru" = "vpos";

  #host: ReactiveControllerHost;
  #loadTask: Task<[NVComment | undefined], FlattedComment[]>;
  #sortTask: Task<
    [FlattedComment[] | undefined, "vpos" | "date" | "nicoru"],
    FlattedComment[]
  >;

  constructor(host: ReactiveControllerHost) {
    this.#host = host;

    this.#loadTask = new Task<[NVComment | undefined], FlattedComment[]>(
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

    this.#sortTask = new Task<
      [FlattedComment[], "vpos" | "date" | "nicoru"],
      FlattedComment[]
    >(
      this.#host,
      (
        [comments = [], order]: [
          FlattedComment[] | undefined,
          "vpos" | "date" | "nicoru",
        ],
        {signal},
      ) => {
        if (comments.length === 0) {
          return comments;
        }

        signal.throwIfAborted();

        switch (order) {
          case "vpos":
            return comments.toSorted(this.#posCompare);
          case "date":
            return comments.toSorted(this.#dateCompare);
          case "nicoru":
            return comments.toSorted(this.#nicoruCompare);
        }
      },
      () => [this.#loadTask.value ?? EMPTY_ARRAY, this.order],
    );

    this.#host.addController(this);
  }

  hostUpdate() {}

  render(renderFunctions: StatusRenderer<FlattedComment[]>) {
    return this.#loadTask.render(renderFunctions);
  }

  sortingRender(renderFunctions: StatusRenderer<FlattedComment[]>) {
    return this.#sortTask.render(renderFunctions);
  }
}
