import type {ApiEndpoints, FetchFunc} from "../../../types";
import type {VideoId} from "../../../types";
import {AccessRights} from "./access-rights";

export class Watch implements ApiEndpoints {
  fetch: FetchFunc;
  endpoint: URL;

  constructor(baseURL: URL | string, customFetch?: FetchFunc) {
    this.fetch = customFetch ?? fetch;
    this.endpoint = new URL("watch/", baseURL);
  }

  accessRights(watchId: VideoId): AccessRights {
    return new AccessRights(watchId, this.endpoint, this.fetch);
  }
}
