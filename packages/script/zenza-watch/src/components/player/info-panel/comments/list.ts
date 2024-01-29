import {LitElement, html} from "lit";
import {customElement, property} from "lit/decorators";
import {consume} from "@lit/context";
import {Task} from "@lit/task";

import {commentContext} from "@/contexts/comment-context";
import type {FlattedComment} from "@/comment-list";
import {durationMsToTimestamp} from "@/utils";

import sheet from "./list.css" with {type: "css"};

export const ORDER_TYPES = [
  ["vpos", "asc", "vposMs", "位置順に並べる"],
  ["date", "desc", "postedAt", "新しい順に並べる"],
  ["nicoru", "desc", "nicoruCount", "ニコるが多い順に並べる"],
] as const;
export type CommentsOrderTypes =
  `${(typeof ORDER_TYPES)[number][0]}:${(typeof ORDER_TYPES)[number][1]}`;
const toOrder = (orderType: (typeof ORDER_TYPES)[number]) =>
  `${orderType[0]}:${orderType[1]}` as CommentsOrderTypes;
const ORDERS = ORDER_TYPES.map(toOrder);
export const isOrderType = (tag: string): tag is CommentsOrderTypes => {
  return (ORDERS as readonly string[]).includes(tag);
};

export const EMPTY_ARRAY: FlattedComment[] = [] as const;

type Compare = (a: FlattedComment, b: FlattedComment) => number;

const sortComments = (
  key: (typeof ORDER_TYPES)[number][2],
  order: (typeof ORDER_TYPES)[number][1],
): Compare => {
  const compare: Compare = (a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    if (aValue > bValue) {
      return 1;
    }
    if (aValue < bValue) {
      return -1;
    }
    return 0;
  };
  switch (order) {
    case "asc":
      return compare;
    case "desc":
      return (a, b) => compare(b, a);
  }
};

const compares = Object.fromEntries(
  ORDER_TYPES.map((orderType) => [
    toOrder(orderType),
    sortComments(orderType[2], orderType[1]),
  ]),
) as {readonly [key in CommentsOrderTypes]: Compare};

const TAG_NAME = "zenza-watch-player-info-panel-comments-list";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerInfoPanelCommentsList;
  }
}

@customElement(TAG_NAME)
export class PlayerInfoPanelCommentsList extends LitElement {
  static styles = sheet;

  @consume({context: commentContext, subscribe: true})
  accessor comments: FlattedComment[] = EMPTY_ARRAY;

  @property({reflect: true})
  accessor order: CommentsOrderTypes = "vpos:asc";

  #task = new Task<[FlattedComment[], CommentsOrderTypes], FlattedComment[]>(
    this,
    async (
      [comments, order]: [FlattedComment[], CommentsOrderTypes],
      {signal},
    ) => {
      if (comments.length === 0) {
        return EMPTY_ARRAY;
      }

      signal.throwIfAborted();

      const result = await new Promise<FlattedComment[]>((resolve, reject) => {
        signal.addEventListener("abort", () => {
          reject(signal.reason);
        });

        return resolve(comments.toSorted(compares[order]));
      });

      return result;
    },
    () => [this.comments, this.order],
  );

  get #sortedComments() {
    return this.#task.value ?? EMPTY_ARRAY;
  }

  render() {
    return this.#sortedComments.map(
      (comment) =>
        html`<div
          class="comment"
          data-id=${comment.id}
          data-no=${comment.no}
          data-thread-id=${comment.threadId}
          data-fork=${comment.fork}>
          <div class="info">
            <span class="vpos">${durationMsToTimestamp(comment.vposMs)}</span>
            <span class="date"
              >${new Date(comment.postedAt).toLocaleString()}</span
            >
          </div>
          <p class="text">${comment.body}</p>
        </div>`,
    );
  }
}
