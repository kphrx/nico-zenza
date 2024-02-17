import type {ApiEndpoints} from "../../../types";
import type {Playlist} from "./types";
import {NvapiEndpoint} from "../../types";

interface SeriesOptions {
  params: {
    pageSize?: `${number}`;
    page?: `${number}`;
    _language?: "ja-jp" | "en-us" | "zh-tw";
  };
}

export class Series implements ApiEndpoints {
  endpoint: URL;

  constructor(baseURL: URL | string) {
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
    );

    return await client.request(options, init);
  }
}
