import {ApiEndpoints} from "../../types";

export class V3 implements ApiEndpoints {
  endpoint: URL;

  constructor(isGuest: boolean, watchId: string, baseURL: URL | string) {
    this.endpoint = new URL(
      `${isGuest ? "v3_guest" : "v3"}/${watchId}`,
      baseURL,
    );
  }
}
