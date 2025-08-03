export function abortReasonError(reason: AbortSignal["reason"]): Error {
  if (reason instanceof Error) {
    return reason;
  }
  return Error(typeof reason === "string" ? reason : "aborted");
}
