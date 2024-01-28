import {LitElement, html} from "lit";
import {customElement, property} from "lit/decorators";
import {consume} from "@lit/context";
import {Task} from "@lit/task";

import {commentContext} from "@/contexts/comment-context";
import type {FlattedComment} from "@/comment-list";

import sheet from "./list.css" with {type: "css"};

const sortComments = (
  key: "postedAt" | "vposMs" | "nicoruCount",
  desc: boolean = false,
) => {
  const compare = (a: FlattedComment, b: FlattedComment) => {
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
  return desc
    ? (a: FlattedComment, b: FlattedComment) => compare(b, a)
    : compare;
};

const posCompare = sortComments("vposMs");
const dateCompare = sortComments("postedAt", true);
const nicoruCompare = sortComments("nicoruCount", true);

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
  accessor order: "vpos" | "date" | "nicoru" = "vpos";

  #task = new Task<
    [FlattedComment[], "vpos" | "date" | "nicoru"],
    FlattedComment[]
  >(
    this,
    async (
      [comments, order]: [FlattedComment[], "vpos" | "date" | "nicoru"],
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

        switch (order) {
          case "vpos":
            return resolve(comments.toSorted(posCompare));
          case "date":
            return resolve(comments.toSorted(dateCompare));
          case "nicoru":
            return resolve(comments.toSorted(nicoruCompare));
        }
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
