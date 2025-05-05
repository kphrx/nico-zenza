import {Session} from "./session";
import {
  initializeMessage,
  isInitialMessageEvent,
  toTransferableRequestInit,
} from "./message-types";
import type {
  GateInitialMessageEvent,
  GatePostMessage,
  GatePostCommands,
  LoaderPostEvent,
  LoaderPostMessage,
  TransferableRequestInit,
} from "./message-types";
import {abortReasonError} from "./utils";

interface CrossDomainGateConstructor {
  token: string;
  baseUrl: URL | string;
  name?: string;
}

export class CrossDomainGate {
  static #nicovideoGate?: CrossDomainGate;
  static async nicovideoGate() {
    if (CrossDomainGate.#nicovideoGate == null) {
      CrossDomainGate.#nicovideoGate = new CrossDomainGate({
        token: "ranbu",
        baseUrl: "https://www.nicovideo.jp/robots.txt",
        name: "nicovideoGate",
      });
      try {
        await CrossDomainGate.#nicovideoGate.start();
      } catch (e) {
        CrossDomainGate.#nicovideoGate = undefined;
        throw e;
      }
    }

    return CrossDomainGate.#nicovideoGate;
  }

  baseUrl: URL | string;
  name: string;
  #token: string;

  #gate?: HTMLIFrameElement;
  #port?: MessagePort;

  #sessions: (Session<"fetch"> | Session<"pong">)[] = [];

  constructor({token, baseUrl, name}: CrossDomainGateConstructor) {
    this.baseUrl = baseUrl;
    this.name = name ?? "cross-domain-gate";
    this.#token = token;
  }

  async start() {
    const timeout = [5, 10, 20, 30, 60];
    let count = 0;
    while (this.#port == null && count < timeout.length) {
      if (this.#gate != null) {
        this.#gate.remove();
        this.#gate = undefined;
      }

      this.#gate = this.#createGate();
      const {promise: wait, resolve} = Promise.withResolvers();
      const oninitialmessage = (ev: MessageEvent<unknown>) => {
        if (!isInitialMessageEvent(ev)) {
          return;
        }

        this.#oninitialmessage(ev, () => {
          window.removeEventListener("message", oninitialmessage);
          resolve(void 0);
        });
      };
      window.addEventListener("message", oninitialmessage, {capture: true});

      document.body.append(this.#gate);
      this.#gate.contentWindow?.location.replace(
        `${this.baseUrl}#token=${this.#token}&origin=${window.origin}`,
      );

      setTimeout(resolve, timeout[count] * 1000);
      await wait;
      count++;
    }

    if (this.#port == null && count === timeout.length) {
      if (this.#gate != null) {
        this.#gate.remove();
        this.#gate = undefined;
      }

      throw Error(`timeout ${this.name}: ${this.baseUrl}`);
    }
  }

  #createGate() {
    const gate = document.createElement("iframe");
    gate.referrerPolicy = "origin";
    gate.sandbox.add("allow-scripts");
    gate.sandbox.add("allow-same-origin");
    gate.loading = "eager";
    gate.style.cssText =
      "position: fixed; left: -100vw; pointer-events: none; user-select: none; contain: strict;";
    gate.name = this.name;

    return gate;
  }

  #oninitialmessage(ev: GateInitialMessageEvent, onfinally: () => void) {
    if (ev.source == null || ev.source !== this.#gate?.contentWindow) {
      return;
    }

    const data = ev.data;
    if (data.token !== this.#token) {
      return;
    }

    const port = (this.#port = ev.ports[0]);
    port.addEventListener("message", this.#onmessage.bind(this));
    port.start();

    onfinally();

    ev.source.postMessage(initializeMessage(data.token));
  }

  #onmessage(ev: LoaderPostEvent<"pong"> | LoaderPostEvent<"fetch">) {
    const data = ev.data;
    if (data.token !== this.#token) {
      return;
    }

    switch (data.command) {
      case "pong":
        break;
      case "fetch":
        this.#receiveFetch(data.sessionId, data.params);
    }
  }

  #receiveFetch(
    sessionId: number,
    result: LoaderPostMessage<"fetch">["params"],
  ) {
    const session = this.#sessions[sessionId];
    if (session.command !== "fetch") {
      return;
    }

    if ("error" in result) {
      session.abort(result.error);
      return;
    }

    const {body, init} = result;
    session.notify(new Response(body, init));
  }

  #postMessage(message: GatePostMessage, transfer: Transferable[] = []) {
    this.#port?.postMessage(message, transfer);
  }

  #abort({
    sessionId,
    reason,
    command,
  }: {
    sessionId: number;
    reason: Error;
    command: GatePostCommands;
  }) {
    const session = this.#sessions[sessionId];
    if (session.command !== command) {
      throw Error("mismatch command");
    }

    const msg: GatePostMessage<"abort"> = {
      type: "gate",
      token: this.#token,
      sessionId,
      command: "abort",
      params: {reason},
    };

    this.#postMessage(msg, [reason]);
  }

  #fetchMessage({
    sessionId,
    ...params
  }: {
    sessionId: number;
    url: string;
    init: TransferableRequestInit;
  }): GatePostMessage<"fetch"> {
    return {
      type: "gate",
      token: this.#token,
      sessionId,
      command: "fetch",
      params,
    };
  }

  #mergeHeaders(
    aHeaders: HeadersInit | undefined,
    bHeaders: HeadersInit | undefined,
  ) {
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
  }

  #mergeRequestInfoAndInit(input: RequestInfo | URL, init: RequestInit) {
    if (input instanceof Request) {
      init.method ??= input.method;
      init.headers = this.#mergeHeaders(input.headers, init.headers);
      init.body ??= input.body;
      init.credentials ??= input.credentials;
      init.signal ??= input.signal;

      return {url: input.url, init};
    } else if (input instanceof URL) {
      return {url: input.toString(), init};
    } else {
      return {url: input, init};
    }
  }

  async fetch(input: RequestInfo | URL, init: RequestInit = {}) {
    const {url, init: requestInit} = this.#mergeRequestInfoAndInit(input, init);
    const {signal, init: transferableInit} =
      toTransferableRequestInit(requestInit);
    signal?.throwIfAborted();

    const session = new Session("fetch", signal ?? undefined);
    const sessionId = this.#sessions.push(session) - 1;
    signal?.addEventListener("abort", () => {
      const reason = abortReasonError(signal.reason);
      this.#abort({sessionId, reason, command: "fetch"});
    });

    this.#postMessage(
      this.#fetchMessage({sessionId, url, init: transferableInit}),
    );

    return await session.promise;
  }
}
