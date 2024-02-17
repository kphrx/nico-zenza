import {LitElement, html} from "lit";
import {customElement, property} from "lit/decorators";

import type {VideoId} from "@nico-zenza/api-wrapper";

import sheet from "./button.css" with {type: "css"};

type ClickEvent = GlobalEventHandlersEventMap["click"];
type OnClickButton = (
  event: ClickEvent,
  videoId: VideoId | `${number}`,
) => void;

@customElement("zenza-hover-menu-button")
export class HoverMenuButton extends LitElement {
  static styles = sheet;

  @property({attribute: "data-video-id", reflect: true})
  accessor videoId: VideoId | `${number}` | undefined;

  #label: string;
  #onClickButton: OnClickButton;

  constructor(label: string, onclick: OnClickButton) {
    super();

    this.#label = label;
    this.#onClickButton = onclick;
  }

  render() {
    return html`<button @click=${this.#onClick.bind(this)}>
      ${this.#label}
    </button>`;
  }

  #onClick(ev: ClickEvent) {
    if (this.videoId != null) {
      this.#onClickButton(ev, this.videoId);
    }
  }
}
