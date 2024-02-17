import type {ApiEndpoints} from "../types";
import {V1} from "./v1";

export class NvComment implements ApiEndpoints {
  endpoint: URL;

  v1: V1;

  constructor(baseURL: string) {
    this.endpoint = new URL(baseURL);

    this.v1 = new V1(this.endpoint);
  }
}
