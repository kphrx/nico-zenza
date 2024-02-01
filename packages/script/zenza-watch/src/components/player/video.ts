import {LitElement, nothing} from "lit";
import {customElement, property} from "lit/decorators";
import {consume} from "@lit/context";
import {default as Hls, Events} from "hls.js";

import {watchDataContext} from "@/contexts/watch-data-context";
import type {WatchV3Response} from "@/watch-data";

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
  accessor watchData: WatchV3Response | undefined;

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

    this.hls.on(Events.MANIFEST_PARSED, (_event, data) => {
      console.info(
        `manifest loaded, found ${data.levels.length} quality level`,
      );
      for (const level of data.levels) {
        console.debug(
          `resolution: ${level.width}x${level.height}, fps: ${Math.floor(level.frameRate)}`,
        );
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

        return nothing;
      },
      complete: ({contentUrl}) => {
        this.src = contentUrl;

        return this.video;
      },
      error: (e) => {
        this.src = undefined;
        console.error(e);

        return nothing;
      },
    });
  }
}
