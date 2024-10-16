import {ApiEndpoint, FetchFunc} from "../../../types";
import {NvapiEndpoint} from "../../types";
import type {Playlist} from "./types";

interface UserUploadedOptions {
  params: {
    sortKey?: string;
    sortOrder?: "asc" | "desc";
    limit?: `${number}`;
    offset?: `${number}`;
    pageSize?: `${number}`;
    page?: `${number}`;
    _language?: "ja-jp" | "en-us" | "zh-tw";
  };
}

export class UserUploaded implements ApiEndpoint {
  fetch: FetchFunc;
  endpoint: URL;

  constructor(baseURL: URL | string, customFetch: FetchFunc) {
    this.fetch = customFetch;
    this.endpoint = new URL("user-uploaded/", baseURL);
  }

  async get(
    userId: `${number}`,
    options: UserUploadedOptions,
    fetchInit?: RequestInit,
  ) {
    const init = {...fetchInit, method: "GET"};

    const client = new NvapiEndpoint<Playlist, UserUploadedOptions>(
      userId,
      this.endpoint,
      this.fetch,
    );

    return await client.request(options, init);
  }
}
