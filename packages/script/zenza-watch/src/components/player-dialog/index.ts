import {LitElement, html} from "lit";
import {customElement, property, state} from "lit/decorators";
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

  #watchData = new WatchDataController(this);

  #videoId = "";

  #closeButton = html`<button
    class="close"
    @click="${() => (this.videoId = "")}">
    Close
  </button>`;

  @state()
  set videoId(value) {
    this.#videoId = value;
    this.open = this.#videoId !== "";
  }
  get videoId() {
    return this.#videoId;
  }

  @property({type: Boolean, reflect: true})
  accessor open = false;

  #onPlayerOpen = (
    ev: GlobalEventHandlersEventMap["zenzawatch:playeropen"],
  ) => {
    const {videoId} = ev.detail;

    this.videoId = videoId;
  };

  constructor() {
    const already = document.querySelector(TAG_NAME);
    if (already != null) {
      return already;
    }

    super();
  }

  override connectedCallback() {
    super.connectedCallback();

    window.addEventListener("zenzawatch:playeropen", this.#onPlayerOpen);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener("zenzawatch:playeropen", this.#onPlayerOpen);
  }

  render() {
    return html`<div>
      ${this.#watchData.render({
        complete: (result: WatchV3Response) =>
          html`<p>Loaded ${this.videoId}: ${result}</p>`,
        initial: () => html`<p>No Video</p>`,
        pending: () => html`<p>Loading ${this.videoId}...</p>`,
        error: (e: unknown) => html`<p>${e}</p>`,
      })}
      ${this.#closeButton}
    </div>`;
  }
}
