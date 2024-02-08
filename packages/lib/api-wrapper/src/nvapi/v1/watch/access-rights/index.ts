import type {ApiEndpoints} from "../../../../types";
import {Hls} from "./hls";

export class AccessRights implements ApiEndpoints {
  endpoint: URL;

  hls: Hls;

  constructor(watchId: string, baseURL: URL | string) {
    this.endpoint = new URL(`${watchId}/access-rights/`, baseURL);

    this.hls = new Hls(this.endpoint);
  }
}
