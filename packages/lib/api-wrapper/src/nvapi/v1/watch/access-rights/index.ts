import type {ApiEndpoints, VideoId} from "../../../../types";
import {Hls} from "./hls";

export class AccessRights implements ApiEndpoints {
  endpoint: URL;

  hls: Hls;

  constructor(watchId: VideoId, baseURL: URL | string) {
    this.endpoint = new URL(`${watchId}/access-rights/`, baseURL);

    this.hls = new Hls(this.endpoint);
  }
}
