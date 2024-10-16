import type {FetchFunc} from "../types";
import {Watch} from "./watch";

export class WwwApi {
  watch: Watch;

  constructor(customFetch?: FetchFunc) {
    const endpoint = new URL("/api/", "https://www.nicovideo.jp");

    this.watch = new Watch(
      endpoint,
      customFetch ?? ((...args) => fetch(...args)),
    );
  }
}
