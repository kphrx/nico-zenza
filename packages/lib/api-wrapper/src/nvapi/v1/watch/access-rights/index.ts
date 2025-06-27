import type {FetchFunc, VideoId} from "../../../../types";
import {Hls} from "./hls";

export class AccessRights {
  hls: Hls;

  constructor(watchId: VideoId, baseURL: URL | string, customFetch: FetchFunc) {
    const endpoint = new URL(`${watchId}/access-rights/`, baseURL);

    this.hls = new Hls(endpoint, customFetch);
  }
}
