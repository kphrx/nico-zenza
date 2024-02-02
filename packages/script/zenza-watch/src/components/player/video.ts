import {LitElement, nothing} from "lit";
import {customElement, property} from "lit/decorators";
import {consume} from "@lit/context";
import {default as Hls, Events, ErrorTypes} from "hls.js";

import {watchDataContext} from "@/contexts/watch-data-context";
import type {WatchDataContext} from "@/contexts/watch-data-context";
import {playerMessageContext} from "@/contexts/player-message-context";
import type {PlayerMessageContext} from "@/contexts/player-message-context";

import {SessionController} from "./session-controller";

import sheet from "./video.css" with {type: "css"};

const TAG_NAME = "zenza-watch-player-video";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerVideo;
  }
}

@customElement(TAG_NAME)
export class PlayerVideo extends LitElement {
  static styles = sheet;

  hls?: Hls;

  video: HTMLVideoElement;

  #src: string = "";
  #session = new SessionController(this);

  @consume({context: watchDataContext, subscribe: true})
  accessor watchData: WatchDataContext;

  @consume({context: playerMessageContext, subscribe: true})
  accessor playerMessage!: PlayerMessageContext;

  @property({reflect: true})
  set src(url) {
    this.#src = url ?? "";

    if (!Hls.isSupported()) {
      this.video.src = this.#src;
      return;
    }

    if (this.#src === "") {
      this.hls?.detachMedia();
      return;
    }

    this.hls?.loadSource(this.#src);
    this.hls?.attachMedia(this.video);
  }
  get src(): string | undefined {
    return this.#src;
  }

  constructor() {
    super();

    this.video = document.createElement("video");
    this.video.autoplay = true;

    if (!Hls.isSupported()) {
      return;
    }

    console.info(`initialize hls.js@${Hls.version}`);

    this.hls = new Hls({
      xhrSetup: (xhr, url) => {
        if (new URL(url).hostname.endsWith("dmc.nico")) {
          return;
        }

        xhr.withCredentials = true;
      },
    });

    this.hls.on(Events.MEDIA_ATTACHED, () => {
      console.debug(`attached hls.js`);
    });
    this.hls.on(Events.MEDIA_DETACHED, () => {
      console.debug(`detached hls.js`);
    });

    this.hls.on(Events.MANIFEST_PARSED, (_eventName, data) => {
      this.playerMessage.success("動画読み込み完了", this.watchData?.video.id);

      console.info(
        `manifest loaded, found ${data.levels.length} quality level`,
      );
      for (const level of data.levels) {
        console.debug(
          `resolution: ${level.width}x${level.height}, fps: ${Math.floor(level.frameRate)}`,
        );
      }
    });

    this.hls.on(Events.ERROR, (_eventName, data) => {
      if (!data.fatal) {
        return;
      }

      this.playerMessage.failure(
        `動画読み込み失敗 ${data.error.message}`,
        this.watchData?.video.id,
      );

      switch (data.type) {
        case ErrorTypes.MEDIA_ERROR:
          console.warn("fatal media error encountered, try to recover");
          this.hls?.recoverMediaError();
          break;
        case ErrorTypes.NETWORK_ERROR:
          console.error("fatal network error encountered", data);
          break;
        default:
          this.hls?.destroy();
          break;
      }
    });
  }

  override connectedCallback() {
    super.connectedCallback();

    if (Hls.isSupported() && this.#src !== "") {
      this.hls?.loadSource(this.#src);
      this.hls?.attachMedia(this.video);
    }
  }

  override disconnectedCallback() {
    if (Hls.isSupported()) {
      this.hls?.detachMedia();
    }

    super.disconnectedCallback();
  }

  render() {
    return this.#session.render({
      pending: () => {
        this.src = undefined;
        if (this.watchData != null) {
          this.playerMessage.info(
            "動画セッション開始中",
            this.watchData.video.id,
          );
        }

        return nothing;
      },
      complete: ({contentUrl}) => {
        this.src = contentUrl;
        this.playerMessage.success(
          "動画セッション開始",
          this.watchData?.video.id,
        );

        return this.video;
      },
      error: (e) => {
        this.src = undefined;
        this.playerMessage.failure(e, this.watchData?.video.id);

        return nothing;
      },
    });
  }
}
