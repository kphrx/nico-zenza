import type {INvapiEndpoints} from "../../types";
import type {VideoId} from "../../../types";
import {AccessRights} from "./access-rights";

export class Watch implements INvapiEndpoints {
  endpoint: URL;

  constructor(baseURL: URL | string) {
    this.endpoint = new URL("watch/", baseURL);
  }

  accessRights(watchId: VideoId): AccessRights {
    return new AccessRights(watchId, this.endpoint);
  }
}
