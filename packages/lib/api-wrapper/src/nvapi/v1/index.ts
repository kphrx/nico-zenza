import type {ApiEndpoints, FetchFunc} from "../../types";
import {Playlist} from "./playlist";
import {Watch} from "./watch";

export class V1 implements ApiEndpoints {
  fetch: FetchFunc;
  endpoint: URL;

  playlist: Playlist;
  watch: Watch;

  constructor(baseURL: URL | string, customFetch?: FetchFunc) {
    this.fetch = customFetch ?? fetch;
    this.endpoint = new URL("v1/", baseURL);

    this.playlist = new Playlist(this.endpoint, this.fetch);
    this.watch = new Watch(this.endpoint, this.fetch);
  }
}
