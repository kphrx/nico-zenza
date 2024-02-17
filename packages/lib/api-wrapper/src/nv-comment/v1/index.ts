import type {ApiEndpoints} from "../../types";
import {Threads} from "./threads";

export class V1 implements ApiEndpoints {
  endpoint: URL;

  threads: Threads;

  constructor(baseURL: URL | string) {
    this.endpoint = new URL("v1/", baseURL);

    this.threads = new Threads(this.endpoint);
  }
}
