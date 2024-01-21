import type {ReactiveController} from "lit";
import type {PlayerDialog} from "./index";

type ReactiveControllerHost = PlayerDialog;

export class OpenController implements ReactiveController {
  #host: ReactiveControllerHost;

  videoId = "";

  #onPlayerOpen = (
    ev: GlobalEventHandlersEventMap["zenzawatch:playeropen"],
  ) => {
    const {videoId} = ev.detail;

    this.#host.setVideoId(videoId);
  };

  constructor(host: ReactiveControllerHost) {
    this.#host = host;
    host.addController(this);
  }

  hostConnected() {
    window.addEventListener("zenzawatch:playeropen", this.#onPlayerOpen);
  }

  hostDisconnected() {
    window.removeEventListener("zenzawatch:playeropen", this.#onPlayerOpen);
  }
}
