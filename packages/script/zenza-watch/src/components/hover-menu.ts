import {LitElement, html, css} from "lit";
import {customElement, property} from "lit/decorators.js";

import {computeBaseZIndex} from "../util";

const TAG_NAME = {
  left: "zenza-left-hover-menu",
  right: "zenza-right-hover-menu",
};

@customElement(TAG_NAME.left)
export class LeftHoverMenu extends LitElement {
  static styles = css`
    :host {
      display: none;
    }
    :host(.show) {
      display: flex;
      position: absolute;
      top: var(--zenza-left-hover-link-top, 0);
      left: var(--zenza-left-hover-link-left, 0);
      z-index: ${parseInt(computeBaseZIndex()) + 100000};

      pointer-events: auto;
      flex-direction: column;
      translate: -16px -12px;
      height: max-content;
    }
  `;

  @property()
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
      this.#updateMenu();
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
        this.#buttons.filter((el) => el === target).length > 0
      ) {
        ev.preventDefault();
        return;
      }
    });
  }

  render() {
    return html`<slot
      name="menu"
      @slotchange="${this.#updateMenu.bind(this)}"></slot>`;
  }

  get #buttons() {
    const slot: HTMLSlotElement | null =
      this.shadowRoot?.querySelector('slot[name="menu"]') ?? null;

    if (slot === null) {
      return [];
    }

    return slot.assignedElements({flatten: true});
  }

  #updateMenu() {
    for (const el of this.#buttons) {
      el.setAttribute("videoId", this.videoId);
    }
  }
}

@customElement(TAG_NAME.right)
export class RightHoverMenu extends LitElement {
  static styles = css`
    :host {
      display: none;
    }
    :host(.show) {
      display: flex;
      position: absolute;
      top: var(--zenza-right-hover-link-top, 0);
      right: var(--zenza-right-hover-link-right, 0);
      z-index: ${parseInt(computeBaseZIndex()) + 100000};

      pointer-events: auto;
      flex-direction: column;
      translate: 16px -12px;
      height: max-content;
    }
  `;

  @property()
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
      this.#updateMenu();
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
        this.#buttons.filter((el) => el === target).length > 0
      ) {
        ev.preventDefault();
        return;
      }
    });
  }

  render() {
    return html`<slot
      name="menu"
      @slotchange="${this.#updateMenu.bind(this)}"></slot>`;
  }

  get #buttons() {
    const slot: HTMLSlotElement | null =
      this.shadowRoot?.querySelector('slot[name="menu"]') ?? null;

    if (slot === null) {
      return [];
    }

    return slot.assignedElements({flatten: true});
  }

  #updateMenu() {
    for (const el of this.#buttons) {
      el.setAttribute("videoId", this.videoId);
    }
  }
}
