import {LoadStats} from "hls.js";
import type {
  Loader,
  LoaderContext,
  LoaderConfiguration,
  LoaderCallbacks,
  LoaderStats,
  LoaderResponse,
  HlsConfig,
} from "hls.js";
import {CrossDomainGate} from "./cross-domain-gate";

type ResponseType = "arraybuffer" | "text";

export class CrossDomainLoader implements Loader<LoaderContext> {
  #fetchSetup: HlsConfig["fetchSetup"];
  #requestTimeout?: number;
  #response: Response | null = null;
  #controller: AbortController;
  context: LoaderContext | null = null;
  #callbacks: LoaderCallbacks<LoaderContext> | null = null;
  stats: LoaderStats;

  constructor(config: HlsConfig) {
    this.#fetchSetup = config.fetchSetup;
    this.#controller = new AbortController();
    this.stats = new LoadStats();
  }

  get #isDestroyed(): boolean {
    return (
      typeof this.#controller === "undefined" ||
      typeof this.context === "undefined" ||
      typeof this.stats === "undefined"
    );
  }

  destroy(): void {
    this.#abortInternal();
    this.#callbacks = this.#response = null;
    this.#fetchSetup = undefined;
    // @ts-expect-error no use after destroy
    this.#controller = this.context = this.stats = undefined;
  }

  abort(): void {
    this.#abortInternal();
    if (this.#callbacks?.onAbort != null && this.context != null) {
      this.#callbacks.onAbort(this.stats, this.context, this.#response);
    }
  }

  #abortInternal(): void {
    if (!this.#isDestroyed && !this.stats.loading.end) {
      this.stats.aborted = true;
      this.#controller.abort();
    }
  }

  load(
    context: LoaderContext,
    config: LoaderConfiguration,
    callbacks: LoaderCallbacks<LoaderContext>,
  ): void {
    const stats = this.stats;
    if (stats.loading.start) {
      throw new Error("Loader can only be used once.");
    }
    stats.loading.start = performance.now();

    this.#load(context, config, callbacks, stats).catch((err: unknown) => {
      clearTimeout(this.#requestTimeout);
      if (stats.aborted) {
        return;
      }
      let code = 0;
      let details;
      if (err instanceof FetchError) {
        code = err.code;
        details = err.details;
      }
      callbacks.onError(
        {code, text: err instanceof Error ? err.message : ""},
        context,
        details,
        stats,
      );
    });
  }

  async #load(
    context: LoaderContext,
    config: LoaderConfiguration,
    callbacks: LoaderCallbacks<LoaderContext>,
    stats: LoaderStats,
  ): Promise<void> {
    let resType: ResponseType;
    switch (context.responseType) {
      case "arraybuffer": {
        resType = context.responseType;
        break;
      }
      default: {
        resType = "text";
        break;
      }
    }

    const reqParams = this.#getRequestParameters(
      context,
      this.#controller.signal,
    );
    const req =
      this.#fetchSetup?.(context, reqParams) ??
      this.#getRequest(context, reqParams);
    const {maxTimeToFirstByteMs, maxLoadTimeMs} = config.loadPolicy;

    this.context = context;
    this.#callbacks = callbacks;
    clearTimeout(this.#requestTimeout);
    const timeout =
      maxTimeToFirstByteMs && Number.isFinite(maxTimeToFirstByteMs)
        ? maxTimeToFirstByteMs
        : maxLoadTimeMs;
    this.#requestTimeout = self.setTimeout(() => {
      this.#abortInternal();
      callbacks.onTimeout(stats, context, this.#response);
    }, timeout);

    const gate = await CrossDomainGate.nicovideoGate();
    const res = (this.#response = await gate.fetch(
      this.#isPromise(req) ? await req : req,
    ));
    const first = Math.max(performance.now(), stats.loading.start);

    clearTimeout(this.#requestTimeout);
    this.#requestTimeout = self.setTimeout(
      () => {
        this.#abortInternal();
        callbacks.onTimeout(stats, context, res);
      },
      config.loadPolicy.maxLoadTimeMs - (first - stats.loading.start),
    );

    if (!res.ok) {
      const {status, statusText} = res;
      throw new FetchError(
        statusText || "fetch, bad network response",
        status,
        res,
      );
    }
    stats.loading.first = first;
    stats.total = this.#getContentLength(res.headers) ?? stats.total;

    let resData: string | ArrayBuffer;
    switch (resType) {
      case "arraybuffer": {
        resData = await res.arrayBuffer();
        break;
      }
      case "text": {
        resData = await res.text();
        break;
      }
    }

    clearTimeout(this.#requestTimeout);
    stats.loading.end = Math.max(performance.now(), stats.loading.first);
    const total =
      resData instanceof ArrayBuffer ? resData.byteLength : resData.length;
    if (total) {
      stats.loaded = stats.total = total;
    }

    const loaderResponse: LoaderResponse = {
      url: context.url,
      data: resData,
      code: res.status,
    };

    callbacks.onProgress?.(stats, context, resData, res);

    callbacks.onSuccess(loaderResponse, stats, context, res);
  }

  #getRequestParameters(
    context: LoaderContext,
    signal: AbortSignal,
  ): RequestInit {
    const headers = new Headers(context.headers);

    if (context.rangeStart && context.rangeEnd) {
      headers.set(
        "Range",
        `bytes=${String(context.rangeStart)}-${String(context.rangeEnd - 1)}`,
      );
    }

    return {
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
      signal,
      headers: new Headers(Object.assign({}, context.headers)),
    };
  }

  #getRequest(context: LoaderContext, initParams: RequestInit): Request {
    return new Request(context.url, initParams);
  }

  #isPromise<T>(p: Promise<T> | T): p is Promise<T> {
    return p != null && "then" in p && typeof p.then === "function";
  }

  #getContentLength(headers: Headers): number | undefined {
    const contentRange = headers.get("Content-Range");
    if (contentRange != null) {
      const [, start, end] = /(\d+)-(\d+)\/(\d+)/.exec(contentRange) ?? [];
      const total = parseInt(end, 10) - parseInt(start, 10) + 1;
      if (Number.isFinite(total)) {
        return total;
      }
    }

    const contentLenght = headers.get("Content-Length");
    if (contentLenght != null) {
      return parseInt(contentLenght, 10);
    }
  }

  getCacheAge(): number | null {
    let result: number | null = null;
    if (this.#response) {
      const ageHeader = this.#response.headers.get("age");
      result = ageHeader ? parseFloat(ageHeader) : null;
    }
    return result;
  }

  getResponseHeader(name: string): string | null {
    return this.#response ? this.#response.headers.get(name) : null;
  }
}

class FetchError extends Error {
  code: number;
  details: Response;
  constructor(message: string, code: number, details: Response) {
    super(message);
    this.code = code;
    this.details = details;
  }
}
