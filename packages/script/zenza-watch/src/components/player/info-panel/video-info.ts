import {LitElement, html, nothing} from "lit";
import {customElement, state} from "lit/decorators";
import type {
  WatchV3Response,
  VideoInfo,
  SeriesInfo,
  ChannelInfo,
  OwnerInfo,
} from "../watch-data";
import sheet from "./video-info.css" with {type: "css"};
import {PlayerInfoPanelCommentsTab} from "./comments";

const TAG_NAME = "zenza-watch-player-info-panel";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerInfoPanel;
  }
}

@customElement(TAG_NAME)
export class PlayerInfoPanel extends LitElement {
  static styles = sheet;

  #commentsTab = new PlayerInfoPanelCommentsTab();

  @state()
  accessor videoInfo: VideoInfo | undefined;

  @state()
  accessor seriesInfo: SeriesInfo | null = null;

  @state()
  accessor channelInfo: ChannelInfo | null = null;

  @state()
  accessor ownerInfo: OwnerInfo | null = null;

  init(watchData: WatchV3Response) {
    this.#commentsTab.init(watchData);
    const {video, series, owner, channel} = watchData;
    this.videoInfo = video;
    this.seriesInfo = series;
    this.channelInfo = channel;
    this.ownerInfo = owner;
  }

  reset() {
    this.#commentsTab.reset();
    this.videoInfo = undefined;
    this.seriesInfo = null;
    this.channelInfo = null;
    this.ownerInfo = null;
  }

  render() {
    const ownerLink = (() => {
      if (this.channelInfo != null) {
        return `https://ch.nicovideo.jp/${this.channelInfo.id}`;
      }
      if (this.ownerInfo != null) {
        return `https://www.nicovideo.jp/user/${this.ownerInfo.id}`;
      }
    })();

    const description = (() => {
      if (this.videoInfo == null) {
        return;
      }

      const domParser = new DOMParser();
      const desc = domParser.parseFromString(
        this.videoInfo.description,
        "text/html",
      );

      return Array.from(desc.body.childNodes);
    })();
    return [
      html`<div class="video-info">
        <div class="owner">
          <a href=${ownerLink ?? "#"} rel="noopener" target="_blank">
            <img
              src=${this.channelInfo?.thumbnail.url ??
              this.ownerInfo?.iconUrl ??
              "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/defaults/blank.jpg"}
              alt="owner-icon" />
          </a>
          <p class="name">
            ${this.channelInfo?.name ??
            this.ownerInfo?.nickname ??
            "(非公開ユーザー)"}
          </p>
        </div>
        <p class="description">${description ?? nothing}</p>
      </div>`,
      this.#commentsTab,
    ];
  }
}
