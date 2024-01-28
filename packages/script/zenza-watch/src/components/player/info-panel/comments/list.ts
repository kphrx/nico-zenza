import {LitElement, html} from "lit";
import {customElement, property} from "lit/decorators";
import {consume} from "@lit/context";
import {Task} from "@lit/task";

import {commentContext} from "@/contexts/comment-context";
import type {FlattedComment} from "@/comment-list";

import {ORDER_TYPES} from "../comments";

import sheet from "./list.css" with {type: "css"};

type CommentsOrderTypes = (typeof ORDER_TYPES)[number][0];
type Compare = (a: FlattedComment, b: FlattedComment) => number;

const sortComments = (
  key: (typeof ORDER_TYPES)[number][2],
  order: (typeof ORDER_TYPES)[number][1] = "asc",
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
  ORDER_TYPES.map(([type, order, key]) => [type, sortComments(key, order)]),
) as {readonly [key in CommentsOrderTypes]: Compare};

const EMPTY_ARRAY: FlattedComment[] = [] as const;

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
  accessor order: CommentsOrderTypes = "vpos";

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
    return html`<ul>
      ${this.#sortedComments.map(
        (comment) =>
          html`<li
            data-id=${comment.id}
            data-no=${comment.no}
            data-thread-id=${comment.threadId}
            data-fork=${comment.fork}
            data-posted-at=${new Date(comment.postedAt).toISOString()}>
            ${comment.body}
          </li>`,
      )}
    </ul>`;
  }
}
