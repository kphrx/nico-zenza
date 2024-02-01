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

  info(message: string) {
    if (!this.isConnected) {
      return;
    }

    void this.#newMessages({
      type: "normal" as const,
      status: message,
      hide: true,
    });
  }

  success(message: string) {
    if (!this.isConnected) {
      return;
    }

    void this.#newMessages({
      type: "success" as const,
      status: message,
      hide: true,
    });
  }

  failure(error: unknown) {
    if (!this.isConnected) {
      return;
    }

    const message = error instanceof Error ? error.message : String(error);
    void this.#newMessages({
      type: "failure" as const,
      status: `ERROR: ${message}`,
      hide: true,
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
