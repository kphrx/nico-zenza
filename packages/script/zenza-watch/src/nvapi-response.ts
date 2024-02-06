interface ErrorResponse {
  meta: {status: number; errorCode: string};
  data?: {reasonCode: string};
}

interface OKResponse<T> {
  meta: {status: number};
  data: T;
}

export type NVAPIResponse<T> = OKResponse<T> | ErrorResponse;
export const isErrorResponse = <T>(
  res: NVAPIResponse<T>,
): res is ErrorResponse => res.meta.status < 200 || 300 <= res.meta.status;
