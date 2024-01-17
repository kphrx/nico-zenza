import {LitElement, html, css} from "lit";
import {customElement, property} from "lit/decorators";
import type {HoverMenuButton} from "./hover-menu-button";
import sheet from "./hover-menu.css" with {type: "css"};

const TAG_NAME_LEFT = "zenza-left-hover-menu";
const TAG_NAME_RIGHT = "zenza-right-hover-menu";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME_LEFT]: LeftHoverMenu;
    [TAG_NAME_RIGHT]: RightHoverMenu;
  }
}

@customElement(TAG_NAME_LEFT)
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

  get #menuSlot(): HTMLSlotElement | null {
    return this.shadowRoot?.querySelector('slot[name="menu"]') ?? null;
  }

  #onLinkMouseEnter = (
    ev: GlobalEventHandlersEventMap["zenza:linkmouseenter"],
  ) => {
    const {top, left, href} = ev.detail;
    this.style.setProperty("--zenza-left-hover-link-top", `${top}px`);
    this.style.setProperty("--zenza-left-hover-link-left", `${left}px`);

    this.videoId = href;
    this.classList.add("show");
  };

  #onLinkMouseOut = () => {
    this.videoId = "";
    this.classList.remove("show");
  };

  #onLinkMouseLeave = (
    ev: GlobalEventHandlersEventMap["zenza:linkmouseleave"],
  ) => {
    const target = ev.detail;
    if (
      target === this ||
      this.buttons().filter((el) => el === target).length > 0
    ) {
      ev.preventDefault();
      return;
    }
  };

  constructor() {
    const already = document.querySelector(TAG_NAME_LEFT);
    if (already != null) {
      return already;
    }

    super();
  }

  override connectedCallback() {
    super.connectedCallback();

    document.body.addEventListener(
      "zenza:linkmouseenter",
      this.#onLinkMouseEnter,
    );

    document.body.addEventListener("zenza:linkmouseout", this.#onLinkMouseOut);
    document.body.addEventListener(
      "zenza:linkmouseleave",
      this.#onLinkMouseLeave,
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    document.body.removeEventListener(
      "zenza:linkmouseenter",
      this.#onLinkMouseEnter,
    );

    document.body.removeEventListener(
      "zenza:linkmouseout",
      this.#onLinkMouseOut,
    );
    document.body.removeEventListener(
      "zenza:linkmouseleave",
      this.#onLinkMouseLeave,
    );
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
      name="menu"
      @slotchange="${this.#onSlotchange.bind(this)}"></slot>`;
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

@customElement(TAG_NAME_RIGHT)
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

  get #menuSlot(): HTMLSlotElement | null {
    return this.shadowRoot?.querySelector('slot[name="menu"]') ?? null;
  }

  #onLinkMouseEnter = (
    ev: GlobalEventHandlersEventMap["zenza:linkmouseenter"],
  ) => {
    const {top, right, href} = ev.detail;
    this.style.setProperty("--zenza-left-hover-link-top", `${top}px`);
    this.style.setProperty("--zenza-right-hover-link-right", `${right}px`);

    this.videoId = href;
    this.classList.add("show");
  };

  #onLinkMouseOut = () => {
    this.videoId = "";
    this.classList.remove("show");
  };

  #onLinkMouseLeave = (
    ev: GlobalEventHandlersEventMap["zenza:linkmouseleave"],
  ) => {
    const target = ev.detail;
    if (
      target === this ||
      this.buttons().filter((el) => el === target).length > 0
    ) {
      ev.preventDefault();
      return;
    }
  };

  constructor() {
    const already = document.querySelector(TAG_NAME_RIGHT);
    if (already != null) {
      return already;
    }

    super();
  }

  override connectedCallback() {
    super.connectedCallback();

    document.body.addEventListener(
      "zenza:linkmouseenter",
      this.#onLinkMouseEnter,
    );

    document.body.addEventListener("zenza:linkmouseout", this.#onLinkMouseOut);
    document.body.addEventListener(
      "zenza:linkmouseleave",
      this.#onLinkMouseLeave,
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    document.body.removeEventListener(
      "zenza:linkmouseenter",
      this.#onLinkMouseEnter,
    );

    document.body.removeEventListener(
      "zenza:linkmouseout",
      this.#onLinkMouseOut,
    );
    document.body.removeEventListener(
      "zenza:linkmouseleave",
      this.#onLinkMouseLeave,
    );
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
      name="menu"
      @slotchange="${this.#onSlotchange.bind(this)}"></slot>`;
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
