import {LitElement, html} from "lit";
import {customElement} from "lit/decorators";
import {consume, provide} from "@lit/context";

import {watchDataContext} from "@/contexts/watch-data-context";
import {commentContext} from "@/contexts/comment-context";
import type {WatchDataContext} from "@/contexts/watch-data-context";
import type {CommentContext} from "@/contexts/comment-context";

import {CommentsController} from "./comments-controller";
import {
  ORDER_TYPES,
  isOrderType,
  EMPTY_ARRAY,
  PlayerInfoPanelCommentsList,
} from "./comments/list";

import base from "./panel.css" with {type: "css"};
import sheet from "./comments.css" with {type: "css"};

const TAG_NAME = "zenza-watch-player-info-panel-comments-tab";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerInfoPanelCommentsTab;
  }
}

@customElement(TAG_NAME)
export class PlayerInfoPanelCommentsTab extends LitElement {
  static styles = [base, sheet];

  #comments = new CommentsController(this);

  #commentList = new PlayerInfoPanelCommentsList();

  @consume({context: watchDataContext, subscribe: true})
  accessor watchData: WatchDataContext;

  get nvComment() {
    return this.watchData?.comment.nvComment;
  }

  @provide({context: commentContext})
  accessor comments: CommentContext;

  #changeOrder = (ev: Event) => {
    const value = (ev.target as HTMLSelectElement | null)?.value ?? "";
    if (!isOrderType(value) || value === this.#commentList.order) {
      return;
    }
    this.#commentList.order = value;
  };

  constructor() {
    super();

    this.comments = EMPTY_ARRAY;
    this.#commentList.className = "scrollable-body";

    this.id = "zenza-player-comments-panel";
    this.role = "tabpanel";
    this.tabIndex = 0;
    this.setAttribute("aria-labelledby", "zenza-player-comments-tab");
  }

  render() {
    return this.#comments.render({
      initial: () => {
        this.comments = EMPTY_ARRAY;

        return html`<div class="empty">
          <p class="status">No comments</p>
        </div>`;
      },
      pending: () => {
        this.comments = EMPTY_ARRAY;
        this.#commentList.order = "vpos:asc";

        return html`<div class="empty">
          <p class="status">Loading commetns...</p>
        </div>`;
      },
      complete: (comments) => {
        this.comments = comments;

        return [
          html`<div class="panel-header">
            <select @change=${this.#changeOrder}>
              ${ORDER_TYPES.map(
                ([orderType, order, , name]) =>
                  html`<option
                    value="${orderType}:${order}"
                    ?selected=${this.#commentList.order ===
                    `${orderType}:${order}`}>
                    ${name}
                  </option>`,
              )}
            </select>
          </div>`,
          this.#commentList,
        ];
      },
      error: (e) => {
        return html`<p>${e}</p>`;
      },
    });
  }
}
