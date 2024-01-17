import {LitElement, html} from "lit";
import {customElement, property} from "lit/decorators";
import sheet from "./player-dialog.css" with {type: "css"};

const TAG_NAME = "zenza-watch-player-dialog";

@customElement(TAG_NAME)
export class PlayerDialog extends LitElement {
  static styles = sheet;

  #videoId = "";

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
    const already = document.querySelector<PlayerDialog>(TAG_NAME);
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
      <button class="close" @click="${() => (this.videoId = "")}">Close</button>
    </div>`;
  }
}
