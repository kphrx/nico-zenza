import {LitElement, html} from "lit";
import {customElement, state} from "lit/decorators";
import {repeat} from "lit/directives/repeat";
import {classMap} from "lit/directives/class-map";

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

  async #newMessages(msg: Message) {
    const id = this.#counter++;
    this.messages.set(this.#counter++, msg);
    this.requestUpdate();

    await sleep(1000);
    msg.hide = false;
    this.requestUpdate();

    await sleep(4000);
    msg.hide = true;
    this.requestUpdate();

    await sleep(1500);
    this.messages.delete(id);
    this.requestUpdate();
  }

  info(message: string, context?: string) {
    if (!this.isConnected) {
      return;
    }

    const prefix = context != null ? `[${context}] ` : "";

    this.#newMessages({
      type: "normal" as const,
      status: prefix + message,
      hide: true,
    }).catch((e) => {
      throw e;
    });
  }

  success(message: string, context?: string) {
    if (!this.isConnected) {
      return;
    }

    const prefix = context != null ? `[${context}] ` : "";

    this.#newMessages({
      type: "success" as const,
      status: prefix + message,
      hide: true,
    }).catch((e) => {
      throw e;
    });
  }

  failure(error: unknown, context?: string) {
    if (!this.isConnected) {
      return;
    }

    const prefix = context != null ? `[${context}] ` : "";
    const message = error instanceof Error ? error.message : String(error);
    this.#newMessages({
      type: "failure" as const,
      status: `${prefix}ERROR: ${message}`,
      hide: true,
    }).catch((e) => {
      throw e;
    });
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
