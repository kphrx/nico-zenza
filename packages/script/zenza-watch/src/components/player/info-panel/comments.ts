import {LitElement, html} from "lit";
import {customElement, state} from "lit/decorators";
import {repeat} from "lit/directives/repeat";
import {consume} from "@lit/context";

import {watchDataContext} from "@/contexts/watch-data-context";
import type {WatchV3Response, NVComment} from "@/watch-data";

import {CommentsController} from "./comments-controller";

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

  @consume({context: watchDataContext, subscribe: true})
  @state()
  accessor watchData: WatchV3Response | undefined;

  get nvComment(): NVComment | undefined {
    return this.watchData?.comment.nvComment;
  }

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
        <select
          @change=${(ev: Event) => {
            this.#comments.order = (ev.target as HTMLSelectElement).value as
              | "vpos"
              | "date"
              | "nicoru";
            this.requestUpdate();
          }}>
          <option value="vpos" ?selected=${this.#comments.order === "vpos"}>
            位置順に並べる
          </option>
          <option value="date" ?selected=${this.#comments.order === "date"}>
            新しい順に並べる
          </option>
          <option value="nicoru" ?selected=${this.#comments.order === "nicoru"}>
            ニコるが多い順に並べる
          </option>
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
