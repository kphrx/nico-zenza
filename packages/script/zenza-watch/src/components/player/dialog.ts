import {LitElement, html} from "lit";
import {customElement, property} from "lit/decorators";
import {PlayerHeader} from "./header";
import {OpenController} from "./open-controller";
import {WatchDataController} from "./watch-data-controller";
import type {WatchV3Response} from "./watch-data";
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
    this.#watchData.videoId = this.#open.videoId;
    this.open = true;
  });

  #header = new PlayerHeader(() => {
    this.#watchData.videoId = "";
    this.#header.reset();
    this.open = false;
  });

  #status!: HTMLParagraphElement;

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
    return html`<div>
      ${this.#watchData.render({
        initial: () => {
          this.#status.textContent = STATUS.Initial;

          return [this.#status, this.#header];
        },
        pending: () => {
          this.#header.reset();
          this.#status.textContent = STATUS.Loading(this.#watchData.videoId);

          return [this.#status, this.#header];
        },
        complete: (result: WatchV3Response) => {
          const {video, owner, channel, tag} = result;
          this.#header.videoInfo = video;
          this.#header.isUser = owner !== null;
          this.#header.isChannel = channel !== null;
          this.#header.tags = tag;
          this.#status.textContent = STATUS.Loaded(this.#watchData.videoId);

          return [this.#status, this.#header];
        },
        error: (e: unknown) => {
          this.#header.reset();
          if (e instanceof Error) {
            this.#status.textContent = STATUS.Error(e.message);
          } else {
            this.#status.textContent = STATUS.Error(e);
          }

          return [this.#status, this.#header];
        },
      })}
    </div>`;
  }
}
