import {LitElement, html} from "lit";
import {customElement, property} from "lit/decorators";
import {OpenController} from "./open-controller";
import {WatchDataController} from "./watch-data-controller";
import type {WatchV3Response} from "./watch-data";
import sheet from "./style.css" with {type: "css"};

const TAG_NAME = "zenza-watch-player-dialog";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerDialog;
  }
}

@customElement(TAG_NAME)
export class PlayerDialog extends LitElement {
  static styles = sheet;

  #open = new OpenController(this);
  #watchData = new WatchDataController(this);

  #closeButton = html`<button
    class="close"
    @click="${() => this.setVideoId("")}">
    Close
  </button>`;

  @property({type: Boolean, reflect: true})
  accessor open = false;

  constructor() {
    const already = document.querySelector(TAG_NAME);
    if (already != null) {
      return already;
    }

    super();
  }

  setVideoId(value: string) {
    this.#watchData.videoId = value;
    this.open = value !== "";
  }

  render() {
    return html`<div>
      ${this.#watchData.render({
        complete: (result: WatchV3Response) =>
          html`<p>Loaded ${this.#watchData.videoId}: ${result}</p>`,
        initial: () => html`<p>No Video</p>`,
        pending: () => html`<p>Loading ${this.#watchData.videoId}...</p>`,
        error: (e: unknown) => html`<p>${e}</p>`,
      })}
      ${this.#closeButton}
    </div>`;
  }
}
