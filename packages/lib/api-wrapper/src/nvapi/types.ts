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

export interface INvapiEndpoints {
  endpoint: URL;
}

export interface INvapiEndpoint<
  T,
  P extends {[key: string]: string | undefined},
> extends INvapiEndpoints {
  defaultInit: RequestInit;

  request(params: P, fetchInit?: RequestInit): Promise<NvapiResponse<T>>;
}

export class NvapiEndpoint<T, P extends {[key: string]: string | undefined}>
  implements INvapiEndpoint<T, P>
{
  endpoint: URL;
  defaultInit: RequestInit;

  constructor(path: string, baseURL: URL | string, fetchInit?: RequestInit) {
    this.endpoint = new URL(path, baseURL);

    if (fetchInit?.headers instanceof Headers) {
      fetchInit.headers.set("X-Frontend-Id", "6");
      fetchInit.headers.set("X-Frontend-Version", "0");
    } else {
      fetchInit = {
        ...fetchInit,
        headers: {
          "X-Frontend-Id": "6",
          "X-Frontend-Version": "0",
        },
      };
    }
    this.defaultInit = fetchInit;
  }

  async request(params: P, fetchInit?: RequestInit): Promise<NvapiResponse<T>> {
    const url = new URL(this.endpoint);
    url.search = new URLSearchParams(
      Object.entries(params).filter(
        (param): param is [string, string] => param[1] != null,
      ),
    ).toString();

    const res = await fetch(url, {...this.defaultInit, ...fetchInit});
    return (await res.json()) as NvapiResponse<T>;
  }
}
