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

    const hoverLink: HTMLAnchorElement | null = el.closest(
      'a[href*="nicovideo.jp/watch/"],a[href*="nico.ms/"]',
    );

    if (hoverLink === this.#target) {
      return;
    }

    if (
      hoverLink === null &&
      (target === this.#host ||
        this.#host.buttons().filter((el) => el === target).length > 0)
    ) {
      return;
    }

    this.#target = hoverLink;

    this.#host.videoId = this.#target?.href ?? "";
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
