import {LitElement, html, nothing} from "lit";
import {customElement, state} from "lit/decorators";
import {classMap} from "lit/directives/class-map";
import type {VideoInfo, Tag} from "./watch-data";
import sheet from "./header.css" with {type: "css"};

const TAG_NAME = "zenza-watch-player-header";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerHeader;
  }
}

@customElement(TAG_NAME)
export class PlayerHeader extends LitElement {
  static styles = sheet;

  @state()
  accessor videoInfo: VideoInfo | undefined;

  @state()
  accessor isUser = false;

  @state()
  accessor isChannel = false;

  @state()
  accessor tags: Tag | undefined;

  #onClose: () => void;

  constructor(onClose: () => void) {
    super();

    this.#onClose = onClose;
  }

  reset() {
    this.videoInfo = undefined;
    this.isUser = false;
    this.isChannel = false;
    this.tags = undefined;
  }

  render() {
    return html`
      <h2 title=${this.videoInfo?.title ?? nothing}>
        ${this.videoInfo?.title ?? nothing}
      </h2>
      <p class="date">
        ${(this.isUser && "投稿日時") ||
        (this.isChannel && "配信日時") ||
        nothing}:
        ${new Date(this.videoInfo?.registeredAt ?? 0).toLocaleString()}
      </p>
      <ul class="count">
        <li>再生: ${this.videoInfo?.count.view ?? 0}</li>
        <li>コメント: ${this.videoInfo?.count.comment ?? 0}</li>
        <li>マイリスト: ${this.videoInfo?.count.mylist ?? 0}</li>
        <li>いいね: ${this.videoInfo?.count.like ?? 0}</li>
      </ul>
      <ul class="tag">
        ${this.tags?.items.map((tag) => {
          return html`<li
            class=${classMap({nicodic: tag.isNicodicArticleExists})}>
            ${tag.name}
          </li>`;
        }) ?? []}
      </ul>
      <button class="close" @click=${this.#onClose}>Close</button>
    `;
  }
}
