import type {ApiEndpoints, VideoId} from "../../types";

export class V3 implements ApiEndpoints {
  endpoint: URL;

  constructor(
    isGuest: boolean,
    watchId: VideoId | `${number}`,
    baseURL: URL | string,
  ) {
    this.endpoint = new URL(
      `${isGuest ? "v3_guest" : "v3"}/${watchId}`,
      baseURL,
    );
  }
}
