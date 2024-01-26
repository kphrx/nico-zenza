import {LitElement, html, nothing} from "lit";
import {customElement, state} from "lit/decorators";
import {consume} from "@lit/context";

import {watchDataContext} from "@/contexts/watch-data-context";
import type {WatchV3Response} from "@/watch-data";

import base from "./panel.css" with {type: "css"};
import sheet from "./video-info.css" with {type: "css"};

const TAG_NAME = "zenza-watch-player-info-panel-video-info-tab";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerInfoPanelVideoInfoTab;
  }
}

@customElement(TAG_NAME)
export class PlayerInfoPanelVideoInfoTab extends LitElement {
  static styles = [base, sheet];

  @consume({context: watchDataContext, subscribe: true})
  @state()
  accessor watchData: WatchV3Response | undefined;

  get #videoInfo() {
    return this.watchData?.video;
  }

  get #seriesInfo() {
    return this.watchData?.series ?? null;
  }

  get #ownerInfo() {
    return this.watchData?.owner ?? null;
  }

  get #channelInfo() {
    return this.watchData?.channel ?? null;
  }

  get #link() {
    if (this.#channelInfo != null) {
      return `https://ch.nicovideo.jp/${this.#channelInfo.id}`;
    }

    if (this.#ownerInfo != null) {
      return `https://www.nicovideo.jp/user/${this.#ownerInfo.id}`;
    }

    return "#";
  }

  get #name() {
    return (
      this.#channelInfo?.name ?? this.#ownerInfo?.nickname ?? "(非公開ユーザー)"
    );
  }

  get #iconUrl() {
    return (
      this.#channelInfo?.thumbnail.url ??
      this.#ownerInfo?.iconUrl ??
      "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/defaults/blank.jpg"
    );
  }

  get #owner() {
    return html`<div class="owner">
      <a href=${this.#link} rel="noopener" target="_blank">
        <img src=${this.#iconUrl} alt="owner-icon" />
      </a>
      <p class="name">${this.#name}</p>
    </div>`;
  }

  get #seriesLink() {
    if (this.#seriesInfo == null) {
      return "#";
    }

    return `https://www.nicovideo.jp/series/${this.#seriesInfo.id}`;
  }

  get #series() {
    if (this.#seriesInfo == null) {
      return nothing;
    }

    return html`<div class="series">
      <img src=${this.#seriesInfo.thumbnailUrl} alt="thumbnail" />
      <a href=${this.#seriesLink} rel="noopener" target="_blank">
        <p class="name">${this.#seriesInfo.title}</p>
      </a>
    </div>`;
  }

  get #desc() {
    if (this.#videoInfo == null) {
      return;
    }

    const domParser = new DOMParser();
    const desc = domParser.parseFromString(
      this.#videoInfo.description,
      "text/html",
    );

    return Array.from(desc.body.childNodes);
  }

  get #description() {
    return html`<p class="description">${this.#desc ?? nothing}</p>`;
  }

  get #seriesPrev() {
    if (this.#seriesInfo == null || this.#seriesInfo.video.prev == null) {
      return nothing;
    }

    const id = this.#seriesInfo.video.prev.id;

    return html`<div class="prev">
      <p>
        前の動画
        <a
          href="https://www.nicovideo.jp/watch/${id}"
          @click=${this.#clickVideo(id)}
          >${id}</a
        >
      </p>
    </div>`;
  }

  get #seriesNext() {
    if (this.#seriesInfo == null || this.#seriesInfo.video.next == null) {
      return nothing;
    }

    const id = this.#seriesInfo.video.next.id;

    return html`<div class="next">
      <p>
        次の動画
        <a
          href="https://www.nicovideo.jp/watch/${id}"
          @click=${this.#clickVideo(id)}
          >${id}</a
        >
      </p>
    </div>`;
  }

  get #seriesNavigation() {
    if (this.#seriesInfo == null) {
      return nothing;
    }

    return html`<div class="series-nav">
      <p>「${this.#seriesInfo.title}」 シリーズ前後の動画</p>
      ${[this.#seriesPrev, this.#seriesNext]}
    </div>`;
  }

  #clickVideo(id: string) {
    return (ev: MouseEvent) => {
      ev.preventDefault();

      window.dispatchEvent(
        new CustomEvent("zenzawatch:playeropen", {detail: {videoId: id}}),
      );
    };
  }

  constructor() {
    super();

    this.id = "zenza-player-video-info-panel";
    this.role = "tabpanel";
    this.tabIndex = 0;
    this.setAttribute("aria-labelledby", "zenza-player-video-info-tab");
  }

  render() {
    return html`<div class="scrollable-body">
      ${[this.#owner, this.#series, this.#description, this.#seriesNavigation]}
    </div>`;
  }
}
