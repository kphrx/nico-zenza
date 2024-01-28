import {LitElement, html} from "lit";
import {customElement} from "lit/decorators";
import {consume, provide} from "@lit/context";

import {watchDataContext} from "@/contexts/watch-data-context";
import {commentContext} from "@/contexts/comment-context";
import type {WatchV3Response} from "@/watch-data";
import type {FlattedComment} from "@/comment-list";

import {CommentsController} from "./comments-controller";
import {PlayerInfoPanelCommentsList} from "./comments/list";

import base from "./panel.css" with {type: "css"};
import sheet from "./comments.css" with {type: "css"};

const EMPTY_ARRAY: FlattedComment[] = [] as const;

const ORDER_TYPES = [
  ["vpos", "位置順に並べる"],
  ["date", "新しい順に並べる"],
  ["nicoru", "ニコるが多い順に並べる"],
] as const;

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
  accessor watchData: WatchV3Response | undefined;

  get nvComment() {
    return this.watchData?.comment.nvComment;
  }

  @provide({context: commentContext})
  accessor comments: FlattedComment[];

  #changeOrder = (ev: Event) => {
    const value = (ev.target as HTMLSelectElement).value;
    if (value === this.#commentList.order) {
      return;
    }
    if (value === "vpos" || value === "date" || value === "nicoru") {
      this.#commentList.order = value;
    }
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

        return html`<p>No comments</p>`;
      },
      pending: () => {
        this.comments = EMPTY_ARRAY;
        this.#commentList.order = "vpos";

        return html`<p>Loading commetns...</p>`;
      },
      complete: (comments) => {
        this.comments = comments;

        return [
          html`<div class="panel-header">
            <select @change=${this.#changeOrder}>
              ${ORDER_TYPES.map(
                ([key, name]) =>
                  html`<option
                    value="${key}"
                    ?selected=${this.#commentList.order === key}>
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
