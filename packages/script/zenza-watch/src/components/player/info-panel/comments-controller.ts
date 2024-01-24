import type {ReactiveController} from "lit";
import type {StatusRenderer} from "@lit/task";
import {initialState, Task} from "@lit/task";
import type {PlayerInfoPanelCommentsTab} from "./comments";
import type {NVAPIResponse, NVComment} from "../watch-data";
import {isErrorResponse} from "../watch-data";

type ReactiveControllerHost = PlayerInfoPanelCommentsTab;

interface ThreadComment {
  id: string;
  no: number;
  vposMs: number;
  body: string;
  commands: string[];
  userId: string;
  isPremium: boolean;
  score: number;
  postedAt: string;
  nicoruCount: number;
  nicoruId: unknown;
  source: string;
  isMyPost: boolean;
}

interface Threads {
  globalComments: {id: string; count: number}[];
  threads: {
    id: string;
    fork: string;
    commentCount: number;
    comments: ThreadComment[];
  }[];
}

interface FlattedComment extends ThreadComment {
  fork: string;
  threadId: string;
}

export class CommentsController implements ReactiveController {
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

  params: NVComment | undefined;

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
                fork: thread.fork,
                threadId: thread.id,
              };
            }),
          );
          return prev;
        }, [] as FlattedComment[]);

        return data;
      },
      () => [this.params],
    );

    this.#host.addController(this);
  }

  hostUpdate() {}

  render(renderFunctions: StatusRenderer<FlattedComment[]>) {
    return this.#task.render(renderFunctions);
  }
}
