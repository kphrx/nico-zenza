import {ApiEndpoints} from "../../../types";
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

export class UserUploaded implements ApiEndpoints {
  endpoint: URL;

  constructor(baseURL: URL | string) {
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
    );

    return await client.request(options, init);
  }
}
