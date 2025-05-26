import type {FetchFunc, VideoId} from "../../../types";
import {AccessRights} from "./access-rights";

export class Watch {
  #fetch: FetchFunc;
  #endpoint: URL;

  constructor(baseURL: URL | string, customFetch: FetchFunc) {
    this.#fetch = customFetch;
    this.#endpoint = new URL("watch/", baseURL);
  }

  accessRights(watchId: VideoId): AccessRights {
    return new AccessRights(watchId, this.#endpoint, this.#fetch);
  }
}
