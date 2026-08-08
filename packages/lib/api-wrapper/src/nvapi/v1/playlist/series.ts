import type {ApiEndpoint, FetchFunc} from "../../../types";
import type {Playlist} from "./types";
import {NvapiEndpoint} from "../../types";

interface SeriesOptions {
  params: {
    pageSize?: `${number}`;
    page?: `${number}`;
    _language?: "ja-jp" | "en-us" | "zh-tw";
  };
}

export class Series implements ApiEndpoint {
  fetch: FetchFunc;
  endpoint: URL;

  constructor(baseURL: URL | string, customFetch: FetchFunc) {
    this.fetch = customFetch;
    this.endpoint = new URL("series/", baseURL);
  }

  async get(
    seriesId: `${number}`,
    options: SeriesOptions,
    fetchInit?: RequestInit,
  ) {
    const init = {...fetchInit, method: "GET"};

    const client = new NvapiEndpoint<Playlist, SeriesOptions>(
      seriesId,
      this.endpoint,
      this.fetch,
    );

    return await client.request(options, init);
  }
}
