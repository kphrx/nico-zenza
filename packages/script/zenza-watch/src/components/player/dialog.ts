import {LitElement, html} from "lit";
import {customElement, property} from "lit/decorators";
import {PlayerHeader} from "./header";
import {PlayerInfoPanel} from "./info-panel";
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

  #status!: HTMLParagraphElement;

  #header = new PlayerHeader(() => {
    this.#watchData.videoId = "";
    this.#header.reset();
    this.#infoPanel.reset();
    this.open = false;
  });

  #infoPanel = new PlayerInfoPanel();

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

          return [this.#status];
        },
        pending: () => {
          this.#header.reset();
          this.#infoPanel.reset();
          this.#status.textContent = STATUS.Loading(this.#watchData.videoId);

          return [this.#status, this.#header, this.#infoPanel];
        },
        complete: (result: WatchV3Response) => {
          this.#header.init(result);
          this.#infoPanel.init(result);
          this.#status.textContent = STATUS.Loaded(this.#watchData.videoId);

          return [this.#status, this.#header, this.#infoPanel];
        },
        error: (e: unknown) => {
          if (e instanceof Error) {
            this.#status.textContent = STATUS.Error(e.message);
          } else {
            this.#status.textContent = STATUS.Error(e);
          }

          return [this.#status, this.#header, this.#infoPanel];
        },
      })}
    </div>`;
  }
}
