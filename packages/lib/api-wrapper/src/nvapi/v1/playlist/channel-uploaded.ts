import {ApiEndpoint, ChannelId, FetchFunc} from "../../../types";
import {NvapiEndpoint} from "../../types";
import type {Playlist} from "./types";

interface ChannelUploadedOptions {
  params: {
    sortKey: string;
    sortOrder: "asc" | "desc";
    limit?: `${number}`;
    offset?: `${number}`;
    pageSize?: `${number}`;
    page?: `${number}`;
    _language?: "ja-jp" | "en-us" | "zh-tw";
  };
}

export class ChannelUploaded implements ApiEndpoint {
  fetch: FetchFunc;
  endpoint: URL;

  constructor(baseURL: URL | string, customFetch: FetchFunc) {
    this.fetch = customFetch;
    this.endpoint = new URL("channel-uploaded/", baseURL);
  }

  async get(
    channelId: ChannelId,
    options: ChannelUploadedOptions,
    fetchInit?: RequestInit,
  ) {
    const init = {...fetchInit, method: "GET"};

    const client = new NvapiEndpoint<Playlist, ChannelUploadedOptions>(
      channelId,
      this.endpoint,
      this.fetch,
    );

    return await client.request(options, init);
  }
}
