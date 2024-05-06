import {LitElement, html} from "lit";
import {customElement, state} from "lit/decorators.js";
import {repeat} from "lit/directives/repeat.js";
import {classMap} from "lit/directives/class-map.js";

import sheet from "./message.css" with {type: "css"};

interface Message {
  type: "normal" | "success" | "failure";
  status: string;
  hide: boolean;
}

const sleep = (duration: number) => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};

const TAG_NAME = "zenza-watch-player-message";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerMessage;
  }
}

@customElement(TAG_NAME)
export class PlayerMessage extends LitElement {
  static styles = sheet;

  #counter = 0;

  @state()
  accessor messages: Map<number, Message> = new Map();

  async #newMessage(msg: Message, showMs: number) {
    const id = this.#counter++;
    this.messages.set(id, msg);
    this.requestUpdate();

    await sleep(500);
    msg.hide = false;
    this.requestUpdate();

    await sleep(showMs);
    msg.hide = true;
    this.requestUpdate();

    await sleep(1000);
    this.messages.delete(id);
    this.requestUpdate();
  }

  #createMessage({
    type,
    message,
    context,
    showMs,
  }: {
    type: Message["type"];
    message: string;
    context?: string;
    showMs: number;
  }) {
    const prefix = context != null ? `[${context}] ` : "";

    this.#newMessage(
      {
        type,
        status: prefix + message,
        hide: true,
      },
      showMs,
    ).catch((e: unknown) => {
      console.error(e);
    });
  }

  info(message: string, context?: string, showMs: number = 3000) {
    if (!this.isConnected) {
      return;
    }

    this.#createMessage({type: "normal", message, showMs, context});
  }

  success(message: string, context?: string, showMs: number = 4000) {
    if (!this.isConnected) {
      return;
    }

    this.#createMessage({type: "success", message, showMs, context});
  }

  failure(error: unknown, context?: string, showMs: number = 6000) {
    if (!this.isConnected) {
      return;
    }

    const message = error instanceof Error ? error.message : String(error);
    this.#createMessage({
      type: "failure",
      message: `ERROR: ${message}`,
      context,
      showMs,
    });
  }

  override disconnectedCallback() {
    this.#counter = 0;
    this.messages.clear();
    super.disconnectedCallback();
  }

  render() {
    return repeat(
      this.messages,
      ([id]) => id,
      ([, message]) => {
        return html`<p
          class=${classMap({message: true, hide: message.hide})}
          data-message-type=${message.type}>
          ${message.status}
        </p>`;
      },
    );
  }
}
