import {LitElement} from "lit";
import {customElement, property} from "lit/decorators";
import {provide} from "@lit/context";

import {watchDataContext} from "@/contexts/watch-data-context";
import type {WatchDataContext} from "@/contexts/watch-data-context";
import {playerMessageContext} from "@/contexts/player-message-context";

import {OpenController} from "./open-controller";
import {WatchDataController} from "./watch-data-controller";
import {PlayerHeader} from "./header";
import {PlayerInfoPanel} from "./info-panel";
import {PlayerVideo} from "./video";
import {PlayerMessage} from "./message";

import sheet from "./dialog.css" with {type: "css"};

const TAG_NAME = "zenza-watch-player-dialog";

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

  #header = new PlayerHeader(() => {
    this.videoId = "";
    this.watchData = undefined;
    this.open = false;
  });

  #infoPanel = new PlayerInfoPanel();

  #video = new PlayerVideo();

  @provide({context: playerMessageContext})
  accessor playerMessage = new PlayerMessage();

  set videoId(value) {
    this.#open.videoId = value;
  }

  get videoId() {
    return this.#open.videoId;
  }

  @provide({context: watchDataContext})
  accessor watchData: WatchDataContext;

  @property({type: Boolean, reflect: true})
  accessor open = false;

  constructor() {
    const already = document.querySelector(TAG_NAME);
    if (already != null) {
      return already;
    }

    super();
  }

  render() {
    return this.#watchData.render({
      initial: () => {
        return [this.playerMessage];
      },
      pending: () => {
        this.playerMessage.info(`動画情報読み込み中 ${this.videoId}`);

        return [this.playerMessage, this.#video, this.#header, this.#infoPanel];
      },
      complete: (result) => {
        this.watchData = result;
        this.playerMessage.success(`動画情報読み込み完了 ${this.videoId}`);

        return [this.playerMessage, this.#video, this.#header, this.#infoPanel];
      },
      error: (e) => {
        this.playerMessage.failure(e);

        return [this.playerMessage, this.#video, this.#header, this.#infoPanel];
      },
    });
  }
}
