import type {INvapiEndpoints} from "../types";
import {Playlist} from "./playlist";
import {Watch} from "./watch";

export class V1 implements INvapiEndpoints {
  endpoint: URL;

  playlist: Playlist;
  watch: Watch;

  constructor(baseURL: URL | string) {
    this.endpoint = new URL("v1/", baseURL);

    this.playlist = new Playlist(this.endpoint);
    this.watch = new Watch(this.endpoint);
  }
}
