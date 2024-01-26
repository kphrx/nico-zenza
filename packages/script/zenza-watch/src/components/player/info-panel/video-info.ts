import {LitElement, html, nothing} from "lit";
import {customElement, state} from "lit/decorators";
import {consume} from "@lit/context";

import {watchDataContext} from "@/contexts/watch-data-context";
import type {
  WatchV3Response,
  VideoInfo,
  SeriesInfo,
  ChannelInfo,
  OwnerInfo,
} from "@/watch-data";

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

  get #videoInfo(): VideoInfo | undefined {
    return this.watchData?.video;
  }

  get #seriesInfo(): SeriesInfo | null {
    return this.watchData?.series ?? null;
  }

  get #ownerInfo(): OwnerInfo | null {
    return this.watchData?.owner ?? null;
  }

  get #channelInfo(): ChannelInfo | null {
    return this.watchData?.channel ?? null;
  }

  constructor() {
    super();

    this.id = "zenza-player-video-info-panel";
    this.role = "tabpanel";
    this.tabIndex = 0;
    this.setAttribute("aria-labelledby", "zenza-player-video-info-tab");
  }

  render() {
    const ownerLink = (() => {
      if (this.#channelInfo != null) {
        return `https://ch.nicovideo.jp/${this.#channelInfo.id}`;
      }
      if (this.#ownerInfo != null) {
        return `https://www.nicovideo.jp/user/${this.#ownerInfo.id}`;
      }
    })();

    const description = (() => {
      if (this.#videoInfo == null) {
        return;
      }

      const domParser = new DOMParser();
      const desc = domParser.parseFromString(
        this.#videoInfo.description,
        "text/html",
      );

      return Array.from(desc.body.childNodes);
    })();

    return html`<div class="scrollable-body">
      <div class="owner">
        <a href=${ownerLink ?? "#"} rel="noopener" target="_blank">
          <img
            src=${this.#channelInfo?.thumbnail.url ??
            this.#ownerInfo?.iconUrl ??
            "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/defaults/blank.jpg"}
            alt="owner-icon" />
        </a>
        <p class="name">
          ${this.#channelInfo?.name ??
          this.#ownerInfo?.nickname ??
          "(非公開ユーザー)"}
        </p>
      </div>
      <p class="description">${description ?? nothing}</p>
    </div>`;
  }
}
