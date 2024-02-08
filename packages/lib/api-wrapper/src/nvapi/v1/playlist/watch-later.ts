import {NvapiEndpoint} from "../../types";
import type {Playlist} from "./types";

interface WatchLaterOptions {
  params: {
    sortKey?: string;
    sortOrder?: "asc" | "desc";
    pageSize?: `${number}`;
    page?: `${number}`;
  };
  language?: "ja-jp" | "en-us" | "zh-tw";
}

export class WatchLater extends NvapiEndpoint<Playlist, WatchLaterOptions> {
  constructor(baseURL: URL | string) {
    super("watch-later", baseURL);
  }

  async get(options: WatchLaterOptions, fetchInit?: RequestInit) {
    const init = {...fetchInit, method: "GET"};

    if (options.language == null) {
      return await this.request(options, init);
    }

    if (init.headers instanceof Headers) {
      init.headers.set("X-Niconico-Language", options.language);
    } else if (init.headers instanceof Array) {
      init.headers.push(["X-Niconico-Language", options.language]);
    } else {
      init.headers = {...init.headers, "X-Niconico-Language": options.language};
    }

    return await this.request(options, init);
  }
}
