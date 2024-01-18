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

    const {top, left, right} = this.#target.getBoundingClientRect();

    return {
      top: top + scrollY,
      left: left + scrollX,
      right: right + scrollX,
    };
  }

  #onMouseMove = ({target}: MouseEvent) => {
    const el = this.targetElement(target);
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
    host.addController(this);
  }

  hostConnected() {
    window.addEventListener("mousemove", this.#onMouseMove);
  }

  hostDisconnected() {
    window.removeEventListener("mousemove", this.#onMouseMove);
  }

  targetElement(target: EventTarget | null) {
    if (target instanceof HTMLElement) {
      return target;
    }

    return null;
  }
}
