import {NvapiEndpoint} from "../../../types";
import type {AccessRights, AccessRightsOptions} from "./types";

interface HlsOptions extends AccessRightsOptions {
  videos: string[];
  audios: string[];
}

export class Hls extends NvapiEndpoint<AccessRights, HlsOptions> {
  constructor(baseURL: URL | string) {
    super("hls", baseURL, {
      headers: {
        "X-Request-With": "https://www.nicovideo.jp",
        "Content-Type": "application/json",
      },
    });
  }

  async post(options: HlsOptions, fetchInit?: RequestInit) {
    const init = {...fetchInit, method: "POST"};

    if (init.headers instanceof Headers) {
      init.headers.set("X-Access-Right-Key", options.accessRightKey);
    } else if (init.headers instanceof Array) {
      init.headers.push(["X-Access-Right-Key", options.accessRightKey]);
    } else {
      init.headers = {
        ...init.headers,
        "X-Access-Right-Key": options.accessRightKey,
      };
    }

    init.body = JSON.stringify({
      outputs: options.videos.flatMap((video) =>
        options.audios.map((audio) => [video, audio]),
      ),
    });

    return await this.request(options, init);
  }
}
