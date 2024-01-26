import {LitElement, html, nothing} from "lit";
import {customElement, state} from "lit/decorators";
import {classMap} from "lit/directives/class-map";
import {consume} from "@lit/context";

import type {WatchV3Response} from "@/watch-data";
import {watchDataContext} from "@/contexts/watch-data-context";

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

  @consume({context: watchDataContext, subscribe: true})
  @state()
  accessor watchData: WatchV3Response | undefined;

  get #videoInfo() {
    return this.watchData?.video;
  }

  get #isUser() {
    return this.watchData?.owner != null;
  }

  get #isChannel() {
    return this.watchData?.channel != null;
  }

  get #tags() {
    return this.watchData?.tag;
  }

  #onClose: () => void;

  constructor(onClose: () => void) {
    super();

    this.#onClose = onClose;
  }

  render() {
    return html`
      <h2 title=${this.#videoInfo?.title ?? nothing}>
        ${this.#videoInfo?.title ?? nothing}
      </h2>
      <p class="date">
        ${(this.#isUser && "投稿日時") ||
        (this.#isChannel && "配信日時") ||
        nothing}:
        ${new Date(this.#videoInfo?.registeredAt ?? 0).toLocaleString()}
      </p>
      <ul class="count">
        <li>再生: ${this.#videoInfo?.count.view ?? 0}</li>
        <li>コメント: ${this.#videoInfo?.count.comment ?? 0}</li>
        <li>マイリスト: ${this.#videoInfo?.count.mylist ?? 0}</li>
        <li>いいね: ${this.#videoInfo?.count.like ?? 0}</li>
      </ul>
      <ul class="tags">
        ${this.#tags?.items.map((tag) => {
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