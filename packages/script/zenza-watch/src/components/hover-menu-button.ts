import {LitElement, html} from "lit";
import {customElement, property} from "lit/decorators.js";
import sheet from "./hover-menu-button.css" with {type: "css"};

@customElement("zenza-hover-menu-button")
export class HoverMenuButton extends LitElement {
  static styles = sheet;

  @property({attribute: "data-video-id", reflect: true})
  accessor videoId: string;

  #label: string;
  #onclick: (event: PointerEvent, videoId: string) => void;

  constructor(
    label: string,
    onclick: (
      ev: GlobalEventHandlersEventMap["click"],
      videoId: string,
    ) => void,
  ) {
    super();
    this.videoId = "";
    this.#label = label;
    this.#onclick = onclick;
  }

  render() {
    return html`<button
      @click=${(ev: PointerEvent) => {
        console.log("test");
        this.#onclick(ev, this.videoId);
      }}>
      ${this.#label}
    </button>`;
  }
}
