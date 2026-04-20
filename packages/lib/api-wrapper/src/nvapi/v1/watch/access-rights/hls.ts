import {mergeHeaders} from "../../../../utils";
import {NvapiEndpoint} from "../../../types";
import type {AccessRights, FetchFunc} from "../../../../types";
import type {AccessRightsOptions} from "./types";

interface HlsOptions extends AccessRightsOptions {
  videos: string[];
  audios: string[];
}

export class Hls extends NvapiEndpoint<AccessRights, HlsOptions> {
  constructor(baseURL: URL | string, customFetch: FetchFunc) {
    super("hls", baseURL, customFetch, {
      headers: {
        "X-Request-With": "https://www.nicovideo.jp",
        "Content-Type": "application/json",
      },
    });
  }

  async post(options: HlsOptions, fetchInit?: RequestInit) {
    const init = {...fetchInit, method: "POST"};

    init.headers = mergeHeaders(init.headers, {
      "X-Access-Right-Key": options.accessRightKey,
    });

    init.body = JSON.stringify({
      outputs: options.videos.flatMap((video) =>
        options.audios.map((audio) => [video, audio]),
      ),
    });

    return await this.request(options, init);
  }
}
