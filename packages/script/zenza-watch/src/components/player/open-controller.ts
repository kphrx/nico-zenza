import type {ReactiveController} from "lit";

import type {VideoId} from "@nico-zenza/api-wrapper";

import type {PlayerDialog as ReactiveControllerHost} from "./dialog";

type OnOpen = (isChanged: boolean) => void;

export class OpenController implements ReactiveController {
  #host: ReactiveControllerHost;
  #onOpen: OnOpen;

  #onPlayerOpen = (
    ev: GlobalEventHandlersEventMap["zenzawatch:playeropen"],
  ) => {
    const {videoId} = ev.detail;
    if (this.videoId === videoId) {
      this.#onOpen(false);
      return;
    }

    this.videoId = videoId;
    this.#onOpen(true);
  };

  videoId?: VideoId | `${number}`;

  constructor(host: ReactiveControllerHost, onOpen: OnOpen) {
    this.#host = host;
    this.#onOpen = onOpen;

    this.#host.addController(this);
  }

  hostConnected() {
    window.addEventListener("zenzawatch:playeropen", this.#onPlayerOpen);
  }

  hostDisconnected() {
    window.removeEventListener("zenzawatch:playeropen", this.#onPlayerOpen);
  }
}
