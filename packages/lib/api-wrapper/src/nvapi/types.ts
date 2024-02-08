import {mergeHeaders} from "../utils";
import type {ApiEndpoints} from "../types";

interface ErrorResponse {
  meta: {status: number; errorCode: string};
  data?: {reasonCode: string};
}
interface OkResponse<T> {
  meta: {status: number};
  data: T;
}
export type NvapiResponse<T> = OkResponse<T> | ErrorResponse;
export const isErrorResponse = <T>(
  res: NvapiResponse<T>,
): res is ErrorResponse => res.meta.status < 200 || 300 <= res.meta.status;

export interface INvapiEndpoint<
  T,
  O extends {params: {[key: string]: string | undefined}},
> extends ApiEndpoints {
  defaultInit: RequestInit;

  request(params: O, fetchInit?: RequestInit): Promise<NvapiResponse<T>>;
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
  ): Promise<NvapiResponse<T>> {
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
    return (await res.json()) as NvapiResponse<T>;
  }
}
