import type {ApiEndpoints, FetchFunc, VideoId} from "../../../../types";
import {Hls} from "./hls";

export class AccessRights implements ApiEndpoints {
  fetch: FetchFunc;
  endpoint: URL;

  hls: Hls;

  constructor(
    watchId: VideoId,
    baseURL: URL | string,
    customFetch?: FetchFunc,
  ) {
    this.fetch = customFetch ?? fetch;
    this.endpoint = new URL(`${watchId}/access-rights/`, baseURL);

    this.hls = new Hls(this.endpoint, this.fetch);
  }
}
