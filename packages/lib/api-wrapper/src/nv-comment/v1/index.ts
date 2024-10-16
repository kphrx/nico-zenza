import type {ApiEndpoints, FetchFunc} from "../../types";
import {Threads} from "./threads";

export class V1 implements ApiEndpoints {
  fetch: FetchFunc;
  endpoint: URL;

  threads: Threads;

  constructor(baseURL: URL | string, customFetch?: FetchFunc) {
    this.fetch = customFetch ?? fetch;
    this.endpoint = new URL("v1/", baseURL);

    this.threads = new Threads(this.endpoint, this.fetch);
  }
}
