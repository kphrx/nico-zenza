import type {ApiEndpoints} from "../../../types";
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

export class Mylist implements ApiEndpoints {
  endpoint: URL;

  constructor(baseURL: URL | string) {
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
    );

    return await client.request(options, init);
  }
}
