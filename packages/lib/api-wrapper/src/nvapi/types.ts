import {mergeHeaders} from "../utils";
import type {ApiEndpoints, ApiResponseWithStatus} from "../types";

export interface INvapiEndpoint<
  T,
  O extends {params: {[key: string]: string | undefined}},
> extends ApiEndpoints {
  defaultInit: RequestInit;

  request(
    params: O,
    fetchInit?: RequestInit,
  ): Promise<ApiResponseWithStatus<T>>;
}

export const HEADER = {
  FRONTEND_ID: "X-Frontend-Id",
  FRONTEND_VERSION: "X-Frontend-Version",
};

export class NvapiEndpoint<
  T,
  O extends {params: {[key: string]: string | undefined}},
> implements INvapiEndpoint<T, O>
{
  endpoint: URL;
  defaultInit: RequestInit;

  constructor(path: string, baseURL: URL | string, fetchInit?: RequestInit) {
    this.endpoint = new URL(path, baseURL);

    if (fetchInit == null) {
      this.defaultInit = {
        headers: {
          [HEADER.FRONTEND_ID]: "6",
          [HEADER.FRONTEND_VERSION]: "0",
        },
      };

      return;
    }

    fetchInit.headers = mergeHeaders(fetchInit.headers, {
      [HEADER.FRONTEND_ID]: "6",
      [HEADER.FRONTEND_VERSION]: "0",
    });
    this.defaultInit = fetchInit;
  }

  async request(
    options: O,
    fetchInit?: RequestInit,
  ): Promise<ApiResponseWithStatus<T>> {
    const url = new URL(this.endpoint);
    url.search = new URLSearchParams(
      Object.entries(options.params).filter(
        (param): param is [string, string] => param[1] != null,
      ),
    ).toString();

    const {headers: defaultHeaders, ...defaultInit} = this.defaultInit;
    const {headers: fetchHeaders, ...init} = fetchInit ?? {};

    if (defaultHeaders == null) {
      throw new Error("not expected default header undefined");
    }

    const res = await fetch(url, {
      ...defaultInit,
      ...init,
      headers: mergeHeaders(defaultHeaders, fetchHeaders),
    });
    return (await res.json()) as ApiResponseWithStatus<T>;
  }
}
