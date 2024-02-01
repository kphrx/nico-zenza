import {LitElement} from "lit";
import {customElement, property} from "lit/decorators";
import {provide} from "@lit/context";

import {watchDataContext} from "@/contexts/watch-data-context";
import type {WatchV3Response} from "@/watch-data";

import {OpenController} from "./open-controller";
import {WatchDataController} from "./watch-data-controller";
import {PlayerHeader} from "./header";
import {PlayerInfoPanel} from "./info-panel";
import {PlayerVideo} from "./video";

import sheet from "./dialog.css" with {type: "css"};

const TAG_NAME = "zenza-watch-player-dialog";

const STATUS = {
  Initial: "No Video",
  Loaded: (id: string) => `Loaded ${id}`,
  Loading: (id: string) => `Loading ${id}...`,
  Error: (e: unknown) => String(e),
} as const;

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerDialog;
  }
}

@customElement(TAG_NAME)
export class PlayerDialog extends LitElement {
  static styles = sheet;

  #watchData = new WatchDataController(this);

  #open = new OpenController(this, () => {
    if (this.open) {
      this.requestUpdate();
    } else {
      this.open = true;
    }
  });

  #status!: HTMLParagraphElement;

  #header = new PlayerHeader(() => {
    this.videoId = "";
    this.watchData = undefined;
    this.open = false;
  });

  #infoPanel = new PlayerInfoPanel();

  #video = new PlayerVideo();

  set videoId(value) {
    this.#open.videoId = value;
  }

  get videoId() {
    return this.#open.videoId;
  }

  @provide({context: watchDataContext})
  accessor watchData: WatchV3Response | undefined;

  @property({type: Boolean, reflect: true})
  accessor open = false;

  constructor() {
    const already = document.querySelector(TAG_NAME);
    if (already != null) {
      return already;
    }

    super();
    this.#status = document.createElement("p");
    this.#status.className = "status";
  }

  render() {
    return this.#watchData.render({
      initial: () => {
        this.#status.textContent = STATUS.Initial;

        return [this.#status];
      },
      pending: () => {
        this.#status.textContent = STATUS.Loading(this.videoId);

        return [this.#status, this.#video, this.#header, this.#infoPanel];
      },
      complete: (result: WatchV3Response) => {
        this.watchData = result;
        this.#status.textContent = STATUS.Loaded(this.videoId);

        return [this.#status, this.#video, this.#header, this.#infoPanel];
      },
      error: (e: unknown) => {
        if (e instanceof Error) {
          this.#status.textContent = STATUS.Error(e.message);
        } else {
          this.#status.textContent = STATUS.Error(e);
        }

        return [this.#status, this.#video, this.#header, this.#infoPanel];
      },
    });
  }
}
