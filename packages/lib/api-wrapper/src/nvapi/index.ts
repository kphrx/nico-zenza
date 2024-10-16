import type {ApiEndpoints, FetchFunc} from "../types";
import {V1} from "./v1";

export class Nvapi implements ApiEndpoints {
  fetch: FetchFunc;
  endpoint: URL;

  v1: V1;

  constructor(baseURL?: string, customFetch?: FetchFunc) {
    this.fetch = customFetch ?? fetch;
    this.endpoint = new URL(baseURL ?? "https://nvapi.nicovideo.jp");

    this.v1 = new V1(this.endpoint, this.fetch);
  }
}
