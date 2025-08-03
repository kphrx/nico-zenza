import {HEADER} from "../../nvapi/types";
import type {
  ApiEndpoint,
  ApiResponseWithStatus,
  VideoId,
  FetchFunc,
} from "../../types";
import type {WatchData} from "../../types/watch-data";
import {mergeHeaders} from "../../utils";

export class V3 implements ApiEndpoint {
  fetch: FetchFunc;
  endpoint: URL;
  defaultInit: RequestInit;

  constructor(
    isGuest: boolean,
    watchId: VideoId | `${number}`,
    baseURL: URL | string,
    customFetch: FetchFunc,
  ) {
    this.fetch = customFetch;
    this.endpoint = new URL(
      `${isGuest ? "v3_guest" : "v3"}/${watchId}`,
      baseURL,
    );
    this.defaultInit = {
      credentials: isGuest ? "omit" : "include",
      headers: {
        [HEADER.FRONTEND_ID]: "6",
        [HEADER.FRONTEND_VERSION]: "0",
      },
    };
  }

  async get(
    options: {params: {actionTrackId: string; additionals?: string}},
    fetchInit?: RequestInit,
  ) {
    const {headers: fetchHeaders, ...init} = {...fetchInit, method: "GET"};

    const url = new URL(this.endpoint);
    url.search = new URLSearchParams(Object.entries(options.params)).toString();

    const {headers: defaultHeaders, ...defaultInit} = this.defaultInit;

    if (defaultHeaders == null) {
      throw new Error("not expected default header undefined");
    }

    const res = await this.fetch(url, {
      ...defaultInit,
      ...init,
      headers: mergeHeaders(defaultHeaders, fetchHeaders),
    });
    return (await res.json()) as ApiResponseWithStatus<WatchData>;
  }
}
