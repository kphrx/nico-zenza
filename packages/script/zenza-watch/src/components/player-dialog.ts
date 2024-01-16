import {LitElement, html} from "lit";
import {customElement} from "lit/decorators";
import sheet from "./player-dialog.css" with {type: "css"};

const TAG_NAME = "zenza-watch-player-dialog";

@customElement(TAG_NAME)
export class PlayerDialog extends LitElement {
  static styles = sheet;

  #onPlayerOpen = (
    ev: GlobalEventHandlersEventMap["zenzawatch:playeropen"],
  ) => {
    const {videoId} = ev.detail;

    console.log(videoId);

    this.classList.add("show");
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
      <button @click="${() => this.classList.remove("show")}">Close</button>
    </div>`;
  }
}
