import type {ApiEndpoint, FetchFunc} from "../../../types";
import type {Playlist} from "./types";
import {NvapiEndpoint} from "../../types";

interface MylistOptions {
  params: {
    sortKey?: string;
    sortOrder?: "asc" | "desc";
    pageSize?: `${number}`;
    page?: `${number}`;
    _language?: "ja-jp" | "en-us" | "zh-tw";
  };
}

export class Mylist implements ApiEndpoint {
  fetch: FetchFunc;
  endpoint: URL;

  constructor(baseURL: URL | string, customFetch: FetchFunc) {
    this.fetch = customFetch;
    this.endpoint = new URL("mylist/", baseURL);
  }

  async get(
    mylistId: `${number}`,
    options: MylistOptions,
    fetchInit?: RequestInit,
  ) {
    const init = {...fetchInit, method: "GET"};

    const client = new NvapiEndpoint<Playlist, MylistOptions>(
      mylistId,
      this.endpoint,
      this.fetch,
    );

    return await client.request(options, init);
  }
}
