import type {FetchFunc} from "../../types";
import {Threads} from "./threads";

export class V1 {
  threads: Threads;

  constructor(baseURL: URL | string, customFetch: FetchFunc) {
    const endpoint = new URL("v1/", baseURL);

    this.threads = new Threads(endpoint, customFetch);
  }
}
