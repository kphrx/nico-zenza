import type {ApiEndpoints, VideoId} from "../../types";
import {V3} from "./v3";

export class Watch implements ApiEndpoints {
  endpoint: URL;

  constructor(baseURL: URL | string) {
    this.endpoint = new URL("watch/", baseURL);
  }

  v3(watchId: VideoId | `${number}`): V3 {
    return new V3(false, watchId, this.endpoint);
  }

  v3Guest(watchId: VideoId | `${number}`): V3 {
    return new V3(true, watchId, this.endpoint);
  }
}
