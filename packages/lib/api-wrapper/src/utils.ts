import type {ApiResponseWithStatus, ErrorResponse} from "./types";

export const mergeHeaders = (
  aHeaders: HeadersInit | undefined,
  bHeaders: HeadersInit | undefined,
): Headers => {
  const headers = new Headers(aHeaders);

  if (bHeaders == null) {
    return headers;
  }

  const bHeaderEntries = (() => {
    if (bHeaders instanceof Headers || bHeaders instanceof Array) {
      return bHeaders;
    }
    return Object.entries(bHeaders);
  })();

  for (const [k, v] of bHeaderEntries) {
    headers.set(k, v);
  }

  return headers;
};

export const isErrorResponse = <T>(
  res: ApiResponseWithStatus<T>,
): res is ErrorResponse => res.meta.status < 200 || 300 <= res.meta.status;
