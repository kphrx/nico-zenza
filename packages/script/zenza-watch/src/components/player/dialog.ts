import {LitElement, html} from "lit";
import {customElement, property} from "lit/decorators.js";
import {provide} from "@lit/context";

import {watchDataContext} from "@/contexts/watch-data-context";
import type {WatchDataContext} from "@/contexts/watch-data-context";
import {commentContext} from "@/contexts/comment-context";
import type {CommentContext} from "@/contexts/comment-context";
import {
  PlayerMessageContext,
  playerMessageContext,
} from "@/contexts/player-message-context";

import {OpenController} from "./open-controller";
import {WatchDataController} from "./watch-data-controller";
import {PlayerHeader} from "./header";
import {PlayerInfoPanel} from "./info-panel";
import {PlayerControls} from "./controls";
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

  #close = html`<button
    class="close"
    @click=${() => {
      this.videoId = undefined;
      this.open = false;
    }}>
    Close
  </button>`;

  #header = new PlayerHeader();

  #infoPanel = new PlayerInfoPanel();

  #controls = new PlayerControls();

  #video = new PlayerVideo();

  @provide({context: playerMessageContext})
  accessor playerMessage!: PlayerMessageContext;

  @provide({context: watchDataContext})
  accessor watchData: WatchDataContext;

  @provide({context: commentContext})
  accessor comments!: CommentContext;

  set videoId(value) {
    if (this.#open.videoId === value) {
      return;
    }

    this.#open.videoId = value;
    this.requestUpdate();
  }

  get videoId() {
    return this.#open.videoId;
  }

  @property({type: Boolean, reflect: true})
  accessor open = false;

  constructor() {
    const already = document.querySelector(TAG_NAME);
    if (already != null) {
      return already;
    }

    super();
    this.playerMessage = new PlayerMessage();
  }

  #timeoutId?: number;

  #mousehover = () => {
    window.clearTimeout(this.#timeoutId);
    if (this.classList.contains("is-autohide")) {
      this.classList.toggle("is-autohide");
    }
    const timeoutId = window.setTimeout(() => {
      if (!this.classList.contains("is-autohide")) {
        this.classList.toggle("is-autohide");
      }
      if (this.#timeoutId === timeoutId) {
        this.#timeoutId = undefined;
      }
    }, 3500);
    this.#timeoutId = timeoutId;
  };

  override connectedCallback() {
    super.connectedCallback();

    this.addEventListener("mousemove", this.#mousehover);
  }

  override disconnectedCallback() {
    this.removeEventListener("mousemove", this.#mousehover);

    super.disconnectedCallback();
  }

  render() {
    return this.#watchData.render({
      initial: () => {
        this.watchData = undefined;
        this.comments = [];

        return [this.#close, this.playerMessage];
      },
      pending: () => {
        this.watchData = undefined;
        this.comments = [];

        return [this.#close, this.playerMessage];
      },
      complete: (result) => {
        this.watchData = result;

        return [
          this.#close,
          this.playerMessage,
          this.#video,
          this.#controls,
          this.#header,
          this.#infoPanel,
        ];
      },
      error: () => {
        this.watchData = undefined;
        this.comments = [];

        return [this.#close, this.playerMessage];
      },
    });
  }
}
