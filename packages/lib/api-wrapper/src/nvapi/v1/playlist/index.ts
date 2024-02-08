import type {ApiEndpoints} from "../../../types";
import {WatchLater} from "./watch-later";

export class Playlist implements ApiEndpoints {
  endpoint: URL;

  watchLater: WatchLater;

  constructor(baseURL: URL | string) {
    this.endpoint = new URL("playlist/", baseURL);

    this.watchLater = new WatchLater(this.endpoint);
  }
}
