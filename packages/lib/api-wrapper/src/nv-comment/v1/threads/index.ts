import type {
  ApiEndpoint,
  ApiResponseWithStatus,
  FetchFunc,
  NVComment,
  NVCommentThreads,
} from "../../../types";
import {HEADER} from "../../../nvapi/types";
import {mergeHeaders} from "../../../utils";

export class Threads implements ApiEndpoint {
  fetch: FetchFunc;
  endpoint: URL;
  defaultInit: RequestInit;

  constructor(baseURL: URL | string, customFetch: FetchFunc) {
    this.fetch = customFetch;
    this.endpoint = new URL("threads", baseURL);

    this.defaultInit = {
      headers: {
        [HEADER.FRONTEND_ID]: "6",
        [HEADER.FRONTEND_VERSION]: "0",
      },
    };
  }

  async post(
    options: {
      body: {
        additionals: Partial<{when: number}>;
        params: NVComment["params"];
        threadKey: NVComment["threadKey"];
      };
    },
    fetchInit?: RequestInit,
  ) {
    const {headers: fetchHeaders, ...init} = {...fetchInit, method: "POST"};

    const {headers: defaultHeaders, ...defaultInit} = this.defaultInit;

    if (defaultHeaders == null) {
      throw new Error("not expected default header undefined");
    }

    const res = await this.fetch(this.endpoint, {
      ...defaultInit,
      ...init,
      body: JSON.stringify(options.body),
      headers: mergeHeaders(defaultHeaders, fetchHeaders),
    });
    return (await res.json()) as ApiResponseWithStatus<NVCommentThreads>;
  }
}
