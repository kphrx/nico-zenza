import type {ApiEndpoints, VideoId, FetchFunc} from "../../types";
import {V3} from "./v3";

export class Watch implements ApiEndpoints {
  fetch: FetchFunc;
  endpoint: URL;

  constructor(baseURL: URL | string, customFetch?: FetchFunc) {
    this.fetch = customFetch ?? fetch;
    this.endpoint = new URL("watch/", baseURL);
  }

  v3(watchId: VideoId | `${number}`): V3 {
    return new V3(false, watchId, this.endpoint, this.fetch);
  }

  v3Guest(watchId: VideoId | `${number}`): V3 {
    return new V3(true, watchId, this.endpoint, this.fetch);
  }
}
