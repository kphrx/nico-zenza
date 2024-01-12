import {LitElement, html, css} from "lit";
import {customElement, property} from "lit/decorators.js";

@customElement("zenza-hover-menu-button")
export class HoverMenuButton extends LitElement {
  static styles = css`
    button {
      display: inline-block;
      opacity: 0.8;
      cursor: pointer;
      font-size: 8pt;
      width: 32px;
      height: 26px;
      padding: 0;
      font-weight: bold;
      text-align: center;
      transition: opacity 0.4s ease;
      user-select: none;
      contain: layout style;
      background: #eee;
      color: #000;
      border: outset 1px;
      box-shadow: 2px 2px rgba(0, 0, 0, 0.8);

      background: #fff;
      border: 2px solid #eee;
      border-radius: 4px;
      color: #555;
    }
    button:hover {
      opacity: 1;
    }
    button:active {
      background: #eee;
    }
  `;

  @property()
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
