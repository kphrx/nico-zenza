import {LitElement, html, css} from "lit";
import {customElement, property} from "lit/decorators.js";
import type {HoverMenuButton} from "./hover-menu-button";
import sheet from "./hover-menu.css" with {type: "css"};

const TAG_NAME = {
  left: "zenza-left-hover-menu",
  right: "zenza-right-hover-menu",
};

@customElement(TAG_NAME.left)
export class LeftHoverMenu extends LitElement {
  static styles = [
    sheet,
    css`
      :host {
        left: var(--zenza-left-hover-link-left, 0);
        translate: -16px -12px;
      }
    `,
  ];

  @property({attribute: "data-video-id", reflect: true})
  accessor videoId: string = "";

  constructor() {
    const already = document.querySelector<LeftHoverMenu>(TAG_NAME.left);
    if (already != null) {
      return already;
    }

    super();
  }

  connectedCallback() {
    super.connectedCallback();

    document.body.addEventListener("zenza:linkmouseenter", (ev) => {
      const {top, left, href} = ev.detail;
      this.style.setProperty("--zenza-left-hover-link-top", `${top}px`);
      this.style.setProperty("--zenza-left-hover-link-left", `${left}px`);

      this.videoId = href;
      this.classList.add("show");
    });

    document.body.addEventListener("zenza:linkmouseout", () => {
      this.videoId = "";
      this.classList.remove("show");
    });
    document.body.addEventListener("zenza:linkmouseleave", (ev) => {
      const target = ev.detail;
      if (
        target === this ||
        this.buttons(this.#buttons).filter((el) => el === target).length > 0
      ) {
        ev.preventDefault();
        return;
      }
    });
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ) {
    super.attributeChangedCallback(name, _old, value);

    if (name !== "data-video-id") {
      return;
    }

    for (const button of this.buttons(this.#buttons)) {
      button.videoId = this.videoId;
    }
  }

  render() {
    return html`<slot
      name="menu"
      @slotchange="${this.#onSlotchange.bind(this)}"></slot>`;
  }

  #onSlotchange(ev: Event) {
    for (const button of this.buttons(ev.target as HTMLSlotElement | null)) {
      button.videoId = this.videoId;
    }
  }

  buttons(slot: HTMLSlotElement | null): HoverMenuButton[] {
    if (slot === null) {
      return [];
    }

    return slot.assignedElements({flatten: true}) as HoverMenuButton[];
  }

  get #buttons(): HTMLSlotElement | null {
    return this.shadowRoot?.querySelector('slot[name="menu"]') ?? null;
  }
}

@customElement(TAG_NAME.right)
export class RightHoverMenu extends LitElement {
  static styles = [
    sheet,
    css`
      :host {
        right: var(--zenza-left-hover-link-right, 0);
        translate: 16px -12px;
      }
    `,
  ];

  @property({attribute: "data-video-id", reflect: true})
  accessor videoId: string = "";

  constructor() {
    const already = document.querySelector<RightHoverMenu>(TAG_NAME.right);
    if (already != null) {
      return already;
    }

    super();
  }

  connectedCallback() {
    super.connectedCallback();

    document.body.addEventListener("zenza:linkmouseenter", (ev) => {
      const {top, right, href} = ev.detail;
      this.style.setProperty("--zenza-right-hover-link-top", `${top}px`);
      this.style.setProperty("--zenza-right-hover-link-right", `${right}px`);

      this.videoId = href;
      this.classList.add("show");
    });

    document.body.addEventListener("zenza:linkmouseout", () => {
      this.videoId = "";
      this.classList.remove("show");
    });
    document.body.addEventListener("zenza:linkmouseleave", (ev) => {
      const target = ev.detail;
      if (
        target === this ||
        this.buttons(this.#buttons).filter((el) => el === target).length > 0
      ) {
        ev.preventDefault();
        return;
      }
    });
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ) {
    super.attributeChangedCallback(name, _old, value);

    if (name !== "data-video-id") {
      return;
    }

    for (const button of this.buttons(this.#buttons)) {
      button.videoId = this.videoId;
    }
  }

  render() {
    return html`<slot
      name="menu"
      @slotchange="${this.#onSlotchange.bind(this)}"></slot>`;
  }

  #onSlotchange(ev: Event) {
    for (const button of this.buttons(ev.target as HTMLSlotElement | null)) {
      button.videoId = this.videoId;
    }
  }

  buttons(slot: HTMLSlotElement | null): HoverMenuButton[] {
    if (slot === null) {
      return [];
    }

    return slot.assignedElements({flatten: true}) as HoverMenuButton[];
  }

  get #buttons(): HTMLSlotElement | null {
    return this.shadowRoot?.querySelector('slot[name="menu"]') ?? null;
  }
}
