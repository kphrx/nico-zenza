import type {ReactiveController} from "lit";
import type {LeftHoverMenu, RightHoverMenu} from "./index";

type ReactiveControllerHost = LeftHoverMenu | RightHoverMenu;

export class MouseController implements ReactiveController {
  #host: ReactiveControllerHost;

  #target: HTMLAnchorElement | null = null;

  get position() {
    if (this.#target == null) {
      return;
    }

    const {scrollY, scrollX} = window;
    const [offsetY, offsetX] = this.#fixedBodyOffset();

    const {top, left, right} = this.#target.getBoundingClientRect();

    return {
      top: top + scrollY - offsetY,
      left: left + scrollX - offsetX,
      right: right + scrollX - offsetX,
    };
  }

  #onMouseMove = ({target}: MouseEvent) => {
    const el = this.#targetElement(target);
    if (el === null) {
      return;
    }

    if (el === this.#target) {
      return;
    }

    if (this.#host.buttons().filter((button) => el === button).length > 0) {
      return;
    }

    const hoverLink: HTMLAnchorElement | null = el.closest(
      'a[href*="//sp.nicovideo.jp/watch/"],a[href*="//www.nicovideo.jp/watch/"],a[href*="//nico.ms/"]',
    );

    if (hoverLink === this.#target) {
      return;
    }

    this.#target = hoverLink;

    if (this.#target === null) {
      this.#host.videoId = "";
      return;
    }

    const link = new URL(this.#target.href);
    const reg =
      link.host === "nico.ms" ? /^\/([a-z0-9]+)/ : /^\/watch\/([a-z0-9]+)/;

    this.#host.videoId = reg.exec(link.pathname)?.[1] ?? "";
  };

  constructor(host: ReactiveControllerHost) {
    this.#host = host;

    this.#host.addController(this);
  }

  hostConnected() {
    window.addEventListener("mousemove", this.#onMouseMove);
  }

  hostDisconnected() {
    window.removeEventListener("mousemove", this.#onMouseMove);
  }

  #fixedBodyOffset() {
    const {position, top, left} = window.getComputedStyle(
      this.#host.parentElement ?? document.body,
    );

    if (position === "fixed" || position === "absolute") {
      const offsetTop = /(-?[0-9]+)px/.exec(top)?.[1] ?? "0";
      const offsetLeft = /(-?[0-9]+)px/.exec(left)?.[1] ?? "0";
      return [parseInt(offsetTop), parseInt(offsetLeft)];
    }

    return [0, 0];
  }

  #targetElement(target: EventTarget | null) {
    if (target instanceof HTMLElement) {
      return target;
    }

    return null;
  }
}
