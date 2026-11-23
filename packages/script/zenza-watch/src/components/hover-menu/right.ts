import {LitElement, html, css} from "lit";
import {customElement, property, queryAssignedElements} from "lit/decorators.js";
import {styleMap} from "lit/directives/style-map.js";

import type {VideoId} from "@nico-zenza/api-wrapper";

import {MouseController} from "./mouse-controller";
import type {HoverMenuButton} from "./button";

import sheet from "./base.css" with {type: "css"};

const TAG_NAME_RIGHT = "zenza-right-hover-menu";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME_RIGHT]: RightHoverMenu;
  }
}

@customElement(TAG_NAME_RIGHT)
export class RightHoverMenu extends LitElement {
  static styles = [
    sheet,
    css`
      slot[name="menu"] {
        translate: 16px -12px;
      }
    `,
  ];

  #mouse = new MouseController(this);

  @property({attribute: "data-video-id", reflect: true})
  accessor videoId: VideoId | `${number}` | undefined;

  @queryAssignedElements({selector: "zenza-hover-menu-button", slot: "menu", flatten: true})
  accessor menuButtons: HoverMenuButton[];

  constructor() {
    const already = document.querySelector(TAG_NAME_RIGHT);
    if (already != null) {
      return already;
    }

    super();
  }

  override attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ) {
    super.attributeChangedCallback(name, _old, value);

    if (name !== "data-video-id") {
      return;
    }

    for (const button of this.menuButtons) {
      button.videoId = this.videoId;
    }
  }

  render() {
    return html`<slot
      style=${styleMap({
        top: `${String(this.#mouse.position?.top ?? 0)}px`,
        right: `${String(this.#mouse.position?.right ?? 0)}px`,
      })}
      name="menu"
      @slotchange=${this.#onSlotchange.bind(this)}></slot>`;
  }

  #onSlotchange(ev: Event) {
    for (const button of this.menuButtons) {
      button.videoId = this.videoId;
    }
  }
}
