export interface ApiEndpoints {
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
