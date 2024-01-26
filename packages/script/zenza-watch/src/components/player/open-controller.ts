import type {ReactiveController} from "lit";

import type {PlayerDialog} from "./dialog";

type ReactiveControllerHost = PlayerDialog;

export class OpenController implements ReactiveController {
  #host: ReactiveControllerHost;
  #onOpen: () => void;

  videoId = "";

  #onPlayerOpen = (
    ev: GlobalEventHandlersEventMap["zenzawatch:playeropen"],
  ) => {
    const {videoId} = ev.detail;

    this.videoId = videoId;
    this.#onOpen();
  };

  constructor(host: ReactiveControllerHost, onOpen: () => void) {
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
