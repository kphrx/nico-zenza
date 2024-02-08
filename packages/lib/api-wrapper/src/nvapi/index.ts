import type {ApiEndpoints} from "../types";
import {V1} from "./v1";

export class Nvapi implements ApiEndpoints {
  endpoint: URL;

  v1: V1;

  constructor(baseURL?: string) {
    this.endpoint = new URL(baseURL ?? "https://nvapi.nicovideo.jp");

    this.v1 = new V1(this.endpoint);
  }
}

export {isErrorResponse} from "./types";
export type {NvapiResponse} from "./types";
