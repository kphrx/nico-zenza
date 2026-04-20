import {abortReasonError} from "./utils";

interface SessionResponseMap {
  fetch: Response;
  pong: undefined;
}

export class Session<T extends keyof SessionResponseMap> {
  command: T;
  promise: Promise<SessionResponseMap[T]>;
  notify!: (args: SessionResponseMap[T]) => void;
  abort!: (reason: Error) => void;

  constructor(type: T, signal?: AbortSignal) {
    this.command = type;
    this.promise = new Promise((resolve, reject) => {
      signal?.addEventListener("abort", () => {
        reject(abortReasonError(signal.reason));
      });
      this.notify = resolve;
      this.abort = reject;
    });
  }
}
