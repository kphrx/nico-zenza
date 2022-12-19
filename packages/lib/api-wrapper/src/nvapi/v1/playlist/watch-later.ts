import {NvapiEndpoint} from "../../types";
import type {Playlist} from "./types";

type WatchLaterParams = {
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  pageSize?: `${number}`;
  page?: `${number}`;
};

export class WatchLater extends NvapiEndpoint<Playlist, WatchLaterParams> {
  constructor(baseURL: URL | string) {
    super("watch-later", baseURL, {
      headers: {
        "X-Frontend-Id": "6",
        "X-Frontend-Version": "0",
      },
    });
  }

  async get(
    params: WatchLaterParams & {language?: "ja-jp" | "en-us" | "zh-tw"},
    fetchInit?: RequestInit,
  ) {
    const init = {...fetchInit, method: "GET"};

    if (params.language == null) {
      return await this.request(params, init);
    }

    if (init.headers instanceof Headers) {
      init.headers.set("X-Niconico-Language", params.language);
    } else {
      init.headers = {...init.headers, "X-Niconico-Language": params.language};
    }

    delete params.language;

    return await this.request(params, init);
  }
}
