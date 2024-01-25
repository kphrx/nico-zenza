import {LitElement, html, nothing} from "lit";
import {customElement, state} from "lit/decorators";
import type {
  VideoInfo,
  SeriesInfo,
  ChannelInfo,
  OwnerInfo,
} from "../watch-data";
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

  @state()
  accessor videoInfo: VideoInfo | undefined;

  @state()
  accessor seriesInfo: SeriesInfo | null = null;

  @state()
  accessor ownerInfo: OwnerInfo | null = null;

  @state()
  accessor channelInfo: ChannelInfo | null = null;

  init({
    video,
    series,
    owner,
    channel,
  }: {
    video: VideoInfo;
    series: SeriesInfo | null;
    owner: OwnerInfo | null;
    channel: ChannelInfo | null;
  }) {
    this.videoInfo = video;
    this.seriesInfo = series;
    this.ownerInfo = owner;
    this.channelInfo = channel;

    this.id = "zenza-player-video-info-panel";
    this.role = "tabpanel";
    this.tabIndex = 0;
    this.setAttribute("aria-labelledby", "zenza-player-video-info-tab");
  }

  reset() {
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

    return html`<div class="scrollable-body">
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
    </div>`;
  }
}
