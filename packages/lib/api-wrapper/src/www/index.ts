import type {ApiEndpoints} from "../types";
import {Watch} from "./watch";

export class WwwApi implements ApiEndpoints {
  endpoint: URL;

  watch: Watch;

  constructor() {
    this.endpoint = new URL("/api/", "https://www.nicovideo.jp");

    this.watch = new Watch(this.endpoint);
  }
}
