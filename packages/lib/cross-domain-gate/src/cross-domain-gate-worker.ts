import {initializeMessage, isInitialMessageEvent} from "./message-types";
import type {GatePostEvent, LoaderPostMessage} from "./message-types";

export function isGateLocation(url: URL) {
  return (
    url.origin === "https://www.nicovideo.jp" && url.pathname === "/robots.txt"
  );
}

interface CrossDomainGateWorkerConstructor {
  token: string | null;
  origin: string | null;
}

export class CrossDomainGateWorker {
  #token: string;
  #origin: string;

  #channel!: MessageChannel;

  get #port() {
    return this.#channel.port1;
  }

  constructor({token, origin}: CrossDomainGateWorkerConstructor) {
    if (token == null || origin == null) {
      throw new Error("missing token/origin");
    }

    this.#token = token;
    this.#origin = origin;
  }

  async start(url: URL) {
    console.time("startup cross domain loader");

    this.#channel = new MessageChannel();
    if (isGateLocation(url)) {
      this.#startNicovideoGate();
    }

    await this.#initialMessage();
  }

  #startNicovideoGate() {
    this.#port.addEventListener(
      "message",
      (
        ev:
          | GatePostEvent<"ping">
          | GatePostEvent<"abort">
          | GatePostEvent<"fetch">,
      ) => {
        const data = ev.data;
        if (data.token !== this.#token) {
          return;
        }

        switch (data.command) {
          case "ping": {
            this.#port.postMessage({
              type: "gate",
              token: this.#token,
              sessionId: data.sessionId,
              command: "pong",
            });
            break;
          }
          case "fetch": {
            const {url, init} = data.params;
            fetch(url, init).then(
              (res) => {
                const {status, statusText, headers} = res;
                this.#postMessage(
                  {
                    type: "gate",
                    token: this.#token,
                    sessionId: data.sessionId,
                    command: "fetch",
                    params: {
                      body: res.body,
                      init: {
                        status,
                        statusText,
                        headers: [...headers.entries()],
                      },
                    },
                  },
                  [res.body].filter((x) => x != null),
                );
              },
              (error: unknown) => {
                if (error instanceof Error) {
                  this.#postMessage(
                    {
                      type: "gate",
                      token: this.#token,
                      sessionId: data.sessionId,
                      command: "fetch",
                      params: {error},
                    },
                    [error],
                  );
                } else {
                  console.warn(error);
                }
              },
            );
          }
        }
      },
    );
    this.#port.start();
  }

  #initialMessage(): Promise<void> {
    return new Promise((r) => {
      const oninitialmessage = (ev: MessageEvent) => {
        if (
          ev.source == null ||
          ev.source !== window.parent ||
          !isInitialMessageEvent(ev)
        ) {
          return;
        }
        const data = ev.data;
        if (data.token !== this.#token) {
          return;
        }
        window.removeEventListener("message", oninitialmessage);

        console.timeEnd("startup cross domain loader");
        r();
      };
      window.addEventListener("message", oninitialmessage);
      window.parent.postMessage(initializeMessage(this.#token), this.#origin, [
        this.#channel.port2,
      ]);
    });
  }

  #postMessage(message: LoaderPostMessage, transfer: Transferable[] = []) {
    this.#port.postMessage(message, transfer);
  }
}
