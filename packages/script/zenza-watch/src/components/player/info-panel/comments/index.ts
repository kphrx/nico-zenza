import {LitElement, html} from "lit";
import {customElement, state} from "lit/decorators.js";
import {consume, provide} from "@lit/context";
import {classMap} from "lit/directives/class-map.js";

import {watchDataContext} from "@/contexts/watch-data-context";
import {commentContext} from "@/contexts/comment-context";
import {playerMessageContext} from "@/contexts/player-message-context";
import type {WatchDataContext} from "@/contexts/watch-data-context";
import type {CommentContext} from "@/contexts/comment-context";
import type {PlayerMessageContext} from "@/contexts/player-message-context";

import {NVCommentController} from "./nv-comment-controller";
import {
  ORDER_TYPES,
  isOrderType,
  EMPTY_ARRAY,
  PlayerInfoPanelCommentsList,
} from "./list";

import base from "../panel.css" with {type: "css"};
import sheet from "./style.css" with {type: "css"};

const TAG_NAME = "zenza-watch-player-info-panel-comments-tab";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerInfoPanelCommentsTab;
  }
}

@customElement(TAG_NAME)
export class PlayerInfoPanelCommentsTab extends LitElement {
  static styles = [base, sheet];

  #nvComment = new NVCommentController(this);

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
    if (!this.autoScroll) {
      return;
    }

    this.#commentList.scrollInto(Math.floor(ev.detail * 1000));
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
    return this.#nvComment.render({
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
