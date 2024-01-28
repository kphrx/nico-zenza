import {LitElement, html, nothing} from "lit";
import {customElement, property} from "lit/decorators";

import {THUMBNAIL} from "@/constants";

import sheet from "./card.css" with {type: "css"};

type ConstructorOption<
  T = {info: ThumbnailInfo} | {videoId: string},
  A = {onclick?: (ev: MouseEvent) => void},
> = A | (A & T);

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

  constructor(options?: ConstructorOption) {
    super();

    if (options == null) {
      return;
    }

    const onclick = options.onclick;
    if (typeof onclick === "function") {
      this.addEventListener("click", onclick);
    }

    if ("info" in options) {
      this.info = options.info;
    }

    if ("videoId" in options) {
      this.videoId = options.videoId;
    }
  }

  render() {
    return html`
      <div class="thumbnail">
        <img
          src=${this.info?.thumbnail.middleUrl ?? THUMBNAIL.VIDEO}
          alt="thumbnail" />
        <span class="duration">${this.#duration}</span>
      </div>
      <div class="info">
        <p class="date">${this.#date}</p>
        <p class="title">
          <a href="${this.#url}">${this.info?.title ?? nothing}</a>
        </p>
      </div>
      <table class="count">
        <thead>
          <tr>
            <th>再生</th>
            <th>コメント</th>
            <th>マイリスト</th>
            <th>いいね</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${this.#count.view}</td>
            <td>${this.#count.comment}</td>
            <td>${this.#count.mylist}</td>
            <td>${this.#count.like}</td>
          </tr>
        </tbody>
      </table>
    `;
  }
}
