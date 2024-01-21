import {LitElement, html, nothing} from "lit";
import {customElement, state} from "lit/decorators";
import type {VideoInfo} from "./watch-data";
import sheet from "./header.css" with {type: "css"};

const TAG_NAME = "zenza-watch-player-header";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerHeader;
  }
}

@customElement(TAG_NAME)
export class PlayerHeader extends LitElement {
  static styles = sheet;

  @state()
  accessor videoInfo: VideoInfo | undefined;

  #onClose: () => void;

  constructor(onClose: () => void) {
    super();

    this.#onClose = onClose;
  }

  render() {
    return html`<div>
      <p>${this.videoInfo?.title ?? nothing}</p>
      <button class="close" @click=${this.#onClose}>Close</button>
    </div>`;
  }
}
