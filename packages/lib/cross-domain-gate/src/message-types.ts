type MessageToken = string;

interface GateInitialMessage {
  type: "gate-initialize";
  token: MessageToken;
}

export function initializeMessage(token: MessageToken): GateInitialMessage {
  return {type: "gate-initialize", token};
}

export type GateInitialMessageEvent = MessageEvent<GateInitialMessage>;

export function isInitialMessageEvent(
  input: MessageEvent<unknown>,
): input is GateInitialMessageEvent {
  const data = input.data;
  return (
    data != null &&
    typeof data === "object" &&
    "type" in data &&
    "token" in data &&
    data.type === "gate-initialize" &&
    typeof data.token === "string"
  );
}

type MessageSessionId = number;

export type TransferableRequestInit = Omit<
  RequestInit,
  "signal" | "headers"
> & {headers: Exclude<RequestInit["headers"], Headers>};

export function toTransferableRequestInit(init: RequestInit): {
  init: TransferableRequestInit;
  signal?: RequestInit["signal"];
} {
  const {signal, headers, ...requestInit} = init;
  return {
    init: Object.assign(
      {headers: [...new Headers(headers).entries()]},
      requestInit,
    ),
    signal,
  };
}

export type TransferableResponseInit = Omit<ResponseInit, "headers"> & {
  headers: Exclude<ResponseInit["headers"], Headers>;
};

export function toTransferableResponseInit(
  init: RequestInit,
): TransferableResponseInit {
  const {headers, ...responseInit} = init;
  return Object.assign(
    {headers: [...new Headers(headers).entries()]},
    responseInit,
  );
}

interface LoaderPostMessageMap {
  pong: undefined;
  fetch: {
    body: BodyInit | null;
    init: TransferableResponseInit;
  };
}

export interface LoaderPostMessage<
  T extends keyof LoaderPostMessageMap = keyof LoaderPostMessageMap,
> {
  type: "gate";
  token: MessageToken;
  sessionId: MessageSessionId;
  command: T;
  params:
    | LoaderPostMessageMap[T]
    | {
        error: Error;
      };
}

export type LoaderPostEvent<T extends keyof LoaderPostMessageMap> =
  MessageEvent<LoaderPostMessage<T>>;

interface GatePostMessageMap {
  ping: undefined;
  abort: {
    reason: Error;
  };
  fetch: {
    url: string;
    init: TransferableRequestInit;
  };
}

export type GatePostCommands = Exclude<keyof GatePostMessageMap, "abort">;

export interface GatePostMessage<
  T extends keyof GatePostMessageMap = keyof GatePostMessageMap,
> {
  type: "gate";
  token: MessageToken;
  sessionId: MessageSessionId;
  command: T;
  params: GatePostMessageMap[T];
}

export type GatePostEvent<T extends keyof GatePostMessageMap> = MessageEvent<
  GatePostMessage<T>
>;
