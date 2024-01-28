import {LitElement, html, nothing} from "lit";
import {customElement} from "lit/decorators";
import {consume} from "@lit/context";

import {watchDataContext} from "@/contexts/watch-data-context";
import type {WatchV3Response, SeriesVideo} from "@/watch-data";

import {PlayerInfoPanelVideoCard} from "./video-info/card";

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
      <p class="name">
        <a href=${this.#seriesLink} rel="noopener" target="_blank">
          ${this.#seriesInfo.title}
        </a>
      </p>
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

  #seriesVideo = (info: SeriesVideo, isPrev: boolean) => {
    const id = info.id;

    const card = new PlayerInfoPanelVideoCard();
    card.info = info;

    return html`<div class="${isPrev ? "prev" : "next"}">
      <p>
        ${isPrev ? "前" : "次"}の動画
        <a
          href="https://www.nicovideo.jp/watch/${id}"
          @click=${this.#clickVideo(id)}>
          ${id}
        </a>
      </p>
      <div class="card" @click=${this.#clickVideo(id)}>${card}</div>
    </div>`;
  };

  get #seriesPrev() {
    if (this.#seriesInfo == null || this.#seriesInfo.video.prev == null) {
      return nothing;
    }

    return this.#seriesVideo(this.#seriesInfo.video.prev, true);
  }

  get #seriesNext() {
    if (this.#seriesInfo == null || this.#seriesInfo.video.next == null) {
      return nothing;
    }

    return this.#seriesVideo(this.#seriesInfo.video.next, false);
  }

  get #seriesNavigation() {
    if (
      this.#seriesInfo == null ||
      (this.#seriesInfo.video.prev == null &&
        this.#seriesInfo.video.next == null)
    ) {
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
