import {LitElement, html} from "lit";
import {customElement} from "lit/decorators";
import {repeat} from "lit/directives/repeat";
import {consume} from "@lit/context";

import {watchDataContext} from "@/contexts/watch-data-context";
import type {WatchV3Response} from "@/watch-data";

import {CommentsController} from "./comments-controller";

import base from "./panel.css" with {type: "css"};
import sheet from "./comments.css" with {type: "css"};

const TAG_NAME = "zenza-watch-player-info-panel-comments-tab";

const ORDER_TYPES = [
  ["vpos", "位置順に並べる"],
  ["date", "新しい順に並べる"],
  ["nicoru", "ニコるが多い順に並べる"],
] as const;

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerInfoPanelCommentsTab;
  }
}

@customElement(TAG_NAME)
export class PlayerInfoPanelCommentsTab extends LitElement {
  static styles = [base, sheet];

  #comments = new CommentsController(this);

  @consume({context: watchDataContext, subscribe: true})
  accessor watchData: WatchV3Response | undefined;

  get nvComment() {
    return this.watchData?.comment.nvComment;
  }

  #changeOrder = (ev: Event) => {
    const value = (ev.target as HTMLSelectElement).value;
    if (value === "vpos" || value === "date" || value === "nicoru") {
      this.#comments.order = value;
      this.requestUpdate();
    }
  };

  constructor() {
    super();

    this.id = "zenza-player-comments-panel";
    this.role = "tabpanel";
    this.tabIndex = 0;
    this.setAttribute("aria-labelledby", "zenza-player-comments-tab");
  }

  render() {
    return [
      html`<div class="panel-header">
        <select @change=${this.#changeOrder}>
          ${ORDER_TYPES.map(
            ([key, name]) =>
              html`<option
                value="${key}"
                ?selected=${this.#comments.order === key}>
                ${name}
              </option>`,
          )}
        </select>
      </div>`,
      this.#comments.render({
        initial: () => {
          return html`<p>No comments</p>`;
        },
        pending: () => {
          return html`<p>Loading commetns...</p>`;
        },
        complete: (comments) => {
          return html`<ul class="scrollable-body">
            ${repeat(
              comments,
              (comment) => comment.id,
              (comment) =>
                html`<li
                  data-id=${comment.id}
                  data-no=${comment.no}
                  data-thread-id=${comment.threadId}
                  data-fork=${comment.fork}
                  data-posted-at=${comment.postedAt}>
                  ${comment.body}
                </li>`,
            )}
          </ul>`;
        },
        error: (e) => {
          return html`<p>${e}</p>`;
        },
      }),
    ];
  }
}
