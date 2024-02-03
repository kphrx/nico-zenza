import {LitElement, html} from "lit";
import {customElement, state} from "lit/decorators";
import {consume, provide} from "@lit/context";
import {classMap} from "lit/directives/class-map";

import {watchDataContext} from "@/contexts/watch-data-context";
import {commentContext} from "@/contexts/comment-context";
import {playerMessageContext} from "@/contexts/player-message-context";
import type {WatchDataContext} from "@/contexts/watch-data-context";
import type {CommentContext} from "@/contexts/comment-context";
import type {PlayerMessageContext} from "@/contexts/player-message-context";

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

  @consume({context: playerMessageContext, subscribe: true})
  accessor playerMessage!: PlayerMessageContext;

  @provide({context: commentContext})
  accessor comments: CommentContext;

  @state()
  accessor autoScroll = false;

  @state()
  set order(value) {
    this.#commentList.order = value;
  }
  get order() {
    return this.#commentList.order;
  }

  constructor() {
    super();

    this.comments = EMPTY_ARRAY;
    this.#commentList.className = "scrollable-body";

    this.id = "zenza-player-comments-panel";
    this.role = "tabpanel";
    this.tabIndex = 0;
    this.setAttribute("aria-labelledby", "zenza-player-comments-tab");
  }

  #switchAutoScroll = () => {
    this.autoScroll = !this.autoScroll;
  };

  #changeOrder = (ev: Event) => {
    const value = (ev.target as HTMLSelectElement | null)?.value ?? "";
    if (!isOrderType(value) || value === this.order) {
      return;
    }
    this.order = value;
  };

  #updateCurrentPosition = (
    ev: GlobalEventHandlersEventMap["zenzawatch:updateCurrentPosition"],
  ) => {
    if (!this.autoScroll || this.order !== "vpos:asc") {
      return;
    }

    const comment = this.#commentList.sortedComments.find((comment) => {
      return comment.vposMs > Math.floor(ev.detail.vpos * 1000);
    });

    if (comment == null) {
      return;
    }

    this.#commentList.renderRoot
      .querySelector(`div.comment[data-id="${comment.id}"]`)
      ?.previousElementSibling?.scrollIntoView();
  };

  override connectedCallback() {
    super.connectedCallback();

    window.addEventListener(
      "zenzawatch:updateCurrentPosition",
      this.#updateCurrentPosition,
    );
  }

  override disconnectedCallback() {
    window.removeEventListener(
      "zenzawatch:updateCurrentPosition",
      this.#updateCurrentPosition,
    );

    super.disconnectedCallback();
  }

  render() {
    return this.#comments.render({
      initial: () => {
        this.comments = EMPTY_ARRAY;

        return html`<div class="empty">
          <p class="status">コメントがありません</p>
        </div>`;
      },
      pending: () => {
        this.comments = EMPTY_ARRAY;
        this.order = "vpos:asc";

        return html`<div class="empty">
          <p class="status">コメント読み込み中</p>
        </div>`;
      },
      complete: (comments) => {
        this.comments = comments;

        return [
          html`<div class="panel-header">
            <button
              class=${classMap({enable: this.autoScroll})}
              @click=${this.#switchAutoScroll}
              ?disabled=${this.order !== "vpos:asc"}>
              自動スクロール
            </button>
            <select @change=${this.#changeOrder}>
              ${ORDER_TYPES.map(
                ([orderType, order, , name]) =>
                  html`<option
                    value="${orderType}:${order}"
                    ?selected=${this.order === `${orderType}:${order}`}>
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
