import type {INvapiEndpoints} from "../types";
import {Playlist} from "./playlist";

export class V1 implements INvapiEndpoints {
  endpoint: URL;

  playlist: Playlist;

  constructor(baseURL: URL | string) {
    this.endpoint = new URL("v1/", baseURL);

    this.playlist = new Playlist(this.endpoint);
  }
}
