import {LitElement, html, css} from "lit";
import {customElement, property} from "lit/decorators.js";
import {styleMap} from "lit/directives/style-map.js";

import type {VideoId} from "@nico-zenza/api-wrapper";

import {MouseController} from "./mouse-controller";
import type {HoverMenuButton} from "./button";

import sheet from "./base.css" with {type: "css"};

const TAG_NAME_LEFT = "zenza-left-hover-menu";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME_LEFT]: LeftHoverMenu;
  }
}

@customElement(TAG_NAME_LEFT)
export class LeftHoverMenu extends LitElement {
  static styles = [
    sheet,
    css`
      slot[name="menu"] {
        translate: -16px -12px;
      }
    `,
  ];

  #mouse = new MouseController(this);

  @property({attribute: "data-video-id", reflect: true})
  accessor videoId: VideoId | `${number}` | undefined;

  get #menuSlot(): HTMLSlotElement | null {
    return this.shadowRoot?.querySelector('slot[name="menu"]') ?? null;
  }

  constructor() {
    const already = document.querySelector(TAG_NAME_LEFT);
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

    for (const button of this.buttons()) {
      button.videoId = this.videoId;
    }
  }

  render() {
    return html`<slot
      style=${styleMap({
        top: `${this.#mouse.position?.top ?? 0}px`,
        left: `${this.#mouse.position?.left ?? 0}px`,
      })}
      name="menu"
      @slotchange=${this.#onSlotchange.bind(this)}></slot>`;
  }

  #onSlotchange(ev: Event) {
    for (const button of this.buttons(ev.target as HTMLSlotElement | null)) {
      button.videoId = this.videoId;
    }
  }

  buttons(slot: HTMLSlotElement | null = this.#menuSlot): HoverMenuButton[] {
    if (slot === null) {
      return [];
    }

    return slot.assignedElements({flatten: true}) as HoverMenuButton[];
  }
}
