import {LitElement, html} from "lit";
import {customElement} from "lit/decorators";
import type {NVComment} from "../watch-data";
import {CommentsController} from "./comments-controller";

const TAG_NAME = "zenza-watch-player-info-panel-comments-tab";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerInfoPanelCommentsTab;
  }
}

@customElement(TAG_NAME)
export class PlayerInfoPanelCommentsTab extends LitElement {
  #comments = new CommentsController(this);

  init({comment: {nvComment}}: {comment: {nvComment: NVComment}}) {
    this.#comments.params = nvComment;
  }

  reset() {
    this.#comments.params = undefined;
  }

  render() {
    return html`<div class="comments">
      ${this.#comments.render({
        initial: () => {
          return html`<p>No comments</p>`;
        },
        pending: () => {
          return html`<p>Loading commetns...</p>`;
        },
        complete: (comments) => {
          return html`<ul>
            ${comments.map((comment) => {
              return html`<li
                data-id=${comment.id}
                data-no=${comment.no}
                data-thread-id=${comment.threadId}
                data-fork=${comment.fork}
                data-posted-at=${comment.postedAt}>
                ${comment.body}
              </li>`;
            })}
          </ul>`;
        },
        error: (e) => {
          return html`<p>${e}</p>`;
        },
      })}
    </div>`;
  }
}
