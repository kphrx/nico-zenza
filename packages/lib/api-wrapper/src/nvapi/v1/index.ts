import type {FetchFunc} from "../../types";
import {Playlist} from "./playlist";
import {Watch} from "./watch";

export class V1 {
  playlist: Playlist;
  watch: Watch;

  constructor(baseURL: URL | string, customFetch: FetchFunc) {
    const endpoint = new URL("v1/", baseURL);

    this.playlist = new Playlist(endpoint, customFetch);
    this.watch = new Watch(endpoint, customFetch);
  }
}
