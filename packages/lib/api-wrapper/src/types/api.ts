export type FetchFunc = (
  ...args: Parameters<typeof fetch>
) => ReturnType<typeof fetch>;

export interface ApiEndpoint {
  fetch: FetchFunc;
  endpoint: URL;
}

export interface ErrorResponse {
  meta: {status: number; errorCode: string};
  data?: {reasonCode: string};
}
export interface OkResponse<T> {
  meta: {status: number};
  data: T;
}
export type ApiResponseWithStatus<T> = OkResponse<T> | ErrorResponse;
