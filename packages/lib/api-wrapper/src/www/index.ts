import type {ApiEndpoints, FetchFunc} from "../types";
import {Watch} from "./watch";

export class WwwApi implements ApiEndpoints {
  fetch: FetchFunc;
  endpoint: URL;

  watch: Watch;

  constructor(customFetch?: FetchFunc) {
    this.fetch = customFetch ?? fetch;
    this.endpoint = new URL("/api/", "https://www.nicovideo.jp");

    this.watch = new Watch(this.endpoint, this.fetch);
  }
}
