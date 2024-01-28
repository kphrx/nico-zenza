import {LitElement, html, nothing} from "lit";
import {customElement, property} from "lit/decorators";

import sheet from "./card.css" with {type: "css"};

export interface ThumbnailInfo {
  id: string;
  title: string;
  count: {
    view: number;
    comment: number;
    mylist: number;
    like: number;
  };
  duration: number;
  thumbnail: {
    url: string;
    middleUrl: string;
    largeUrl: string;
  };
  registeredAt: string;
}

const TAG_NAME = "zenza-watch-player-info-panel-video-card";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerInfoPanelVideoCard;
  }
}

@customElement(TAG_NAME)
export class PlayerInfoPanelVideoCard extends LitElement {
  static styles = sheet;

  // TODO: create task to get thumbnail info from video id
  @property()
  accessor videoId: string | undefined;

  @property({attribute: false})
  accessor info: ThumbnailInfo | undefined;

  get #url() {
    const id = this.info?.id;
    if (id == null) {
      return "#";
    }

    return `https://www.nicovideo.jp/watch/${id}`;
  }

  get #date() {
    return new Date(this.info?.registeredAt ?? 0).toLocaleString();
  }

  get #count() {
    return this.info?.count ?? {view: 0, comment: 0, mylist: 0, like: 0};
  }

  get #duration() {
    const datetime = new Date((this.info?.duration ?? 0) * 1000);
    const hours = datetime.getUTCHours();
    const minutes = String(datetime.getUTCMinutes()).padStart(2, "0");
    const seconds = String(datetime.getUTCSeconds()).padStart(2, "0");
    const formattedDuration =
      hours > 0
        ? `${String(hours).padStart(2, "0")}:${minutes}:${seconds}`
        : `${minutes}:${seconds}`;

    return formattedDuration;
  }

  render() {
    return html`
      <div class="thumbnail">
        <img
          src=${this.info?.thumbnail.middleUrl ??
          "http://nicovideo.cdn.nimg.jp/web/img/common/no_thumbnail_M.jpg"}
          alt="thumbnail" />
        <span class="duration">${this.#duration}</span>
      </div>
      <div class="info">
        <p class="date">${this.#date}</p>
        <p class="title">
          <a href="${this.#url}">${this.info?.title ?? nothing}</a>
        </p>
      </div>
      <ul class="count">
        <li>再生: <span class="value">${this.#count.view}</span></li>
        <li>コメント: <span class="value">${this.#count.comment}</span></li>
        <li>マイリスト: <span class="value">${this.#count.mylist}</span></li>
        <li>いいね: <span class="value">${this.#count.like}</span></li>
      </ul>
    `;
  }
}
