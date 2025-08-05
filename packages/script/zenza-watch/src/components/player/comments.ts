import {LitElement, html} from "lit";
import {customElement} from "lit/decorators.js";
import {consume} from "@lit/context";

import {commentContext} from "@/contexts/comment-context";
import type {CommentContext} from "@/contexts/comment-context";

import sheet from "./comments.css" with {type: "css"};

const TAG_NAME = "zenza-watch-player-comments";

type SetUnion<S> = S extends Set<infer T> ? T : never;

const COMMANDS = {
  COLOR: {
    white: "#ffffff",
    red: "#ff0000",
    pink: "#ff8080",
    orange: "#ff3000",
    yellow: "#ffff00",
    green: "#00ff00",
    cyan: "#00ffff",
    blue: "#0000ff",
    purple: "#c000ff",
    black: "#000000",
  },
  COLOR_PREMIUM: {
    white2: "#cccc99",
    get niconicowhite() {
      return this.white2;
    },
    red2: "#cc0033",
    get truered() {
      return this.red2;
    },
    pink2: "#ff33cc",
    orange2: "#ff6600",
    get passionorange() {
      return this.orange2;
    },
    yellow2: "#999900",
    get madyellow() {
      return this.yellow2;
    },
    green2: "#00cc66",
    get elementalgreen() {
      return this.green2;
    },
    cyan2: "#00cccc",
    blue2: "#3399ff",
    get marineblue() {
      return this.blue2;
    },
    purple2: "#6633cc",
    get nobleviolet() {
      return this.purple2;
    },
    black2: "#666666",
  },
  SIZE: new Set(["small", "medium", "big"] as const),
  POSITION: new Set(["ue", "shita", "naka"] as const),
  FONT: new Set(["mincho", "gothic", "defont"] as const),
};

type RecordKey = string | number | symbol;

const hasRecordCommand = <U extends Record<RecordKey, unknown>>(
  list: U,
  cmd: RecordKey,
): cmd is keyof U => {
  return cmd in list;
};

const hasSetCommand = <U extends Set<unknown>>(
  set: U,
  cmd: unknown,
): cmd is SetUnion<U> => {
  return set.has(cmd);
};

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerComments;
  }
}

@customElement(TAG_NAME)
export class PlayerComments extends LitElement {
  static styles = sheet;

  @consume({context: commentContext, subscribe: true})
  accessor comments!: CommentContext;

  get #ngCommands(): Set<string> | "all" {
    return new Set(["184"]);
  }

  get #defaultCommands(): {
    size: "small" | "medium" | "big";
    position: "ue" | "shita" | "naka";
    duration: number;
    color: string;
  } {
    return {
      size: "medium",
      position: "naka",
      duration: 4000,
      color: "#ffffff",
    };
  }

  #isNgCommand(cmd: string) {
    if (this.#ngCommands === "all") {
      return true;
    }
    return this.#ngCommands.has(cmd);
  }

  #parseCommands(
    commands: string[],
    {isPremium, isOwner}: {isPremium: boolean; isOwner: boolean},
  ) {
    let size, position, font, color, duration;
    let isFull = false;
    let isEnder = false;
    let isPatissier = false;
    let isCa = false;
    let isInvisible = false;
    let isLive = false;

    for (const cmd of commands) {
      if (this.#isNgCommand(cmd)) {
        continue;
      }

      if (hasSetCommand(COMMANDS.SIZE, cmd)) {
        size ??= cmd;
        continue;
      }

      if (hasSetCommand(COMMANDS.POSITION, cmd)) {
        position ??= cmd;
        if (cmd === "naka") {
          duration ??= 4000;
        } else {
          duration ??= 2900;
        }
        continue;
      }

      if (hasSetCommand(COMMANDS.FONT, cmd)) {
        font ??= cmd;
        continue;
      }

      if (hasRecordCommand(COMMANDS.COLOR, cmd)) {
        color ??= COMMANDS.COLOR[cmd];
        continue;
      }

      if (hasRecordCommand(COMMANDS.COLOR_PREMIUM, cmd)) {
        if (isPremium) {
          color ??= COMMANDS.COLOR_PREMIUM[cmd];
        }
        continue;
      }

      switch (cmd) {
        // style
        case "full":
          isFull = true;
          continue;
        case "ender":
          isEnder = true;
          continue;

        // memory
        case "patissier":
          isPatissier = true;
          continue;
        case "ca":
          isCa = true;
          continue;
        case "invisible":
          isInvisible = true;
          continue;

        // other
        case "_live":
          isLive = true;
          continue;
      }

      const colorMatch = /(#[0-9a-f]+)/i.exec(cmd);
      if (colorMatch != null) {
        if (isPremium) {
          color ??= colorMatch[1];
        }
        continue;
      }

      const durationMatch = /[@＠]([0-9]+)(?:\.(?<decimal>[0-9]+))?/.exec(cmd);
      if (durationMatch != null) {
        if (!isOwner || duration != null) {
          continue;
        }
        const sec = durationMatch[1];
        const ms = durationMatch.groups?.decimal ?? "0";
        duration = parseFloat(
          `${sec}${ms.padEnd(3, "0").slice(0, 3)}.${ms.slice(3)}`,
        );
        continue;
      }
    }

    return {
      size,
      position,
      font,
      color,
      duration,
      isFull,
      isEnder,
      isPatissier,
      isCa,
      isInvisible,
      isLive,
    };
  }

  get #commentItems() {
    return this.comments
      .toSorted((a, b) => {
        return a.vposMs - b.vposMs;
      })
      .map((comment) => {
        const {
          size = this.#defaultCommands.size,
          position = this.#defaultCommands.position,
          color = this.#defaultCommands.color,
          duration = this.#defaultCommands.duration,
          font,
          isFull,
          isEnder,
          isPatissier,
          isCa,
          isInvisible,
          isLive,
        } = this.#parseCommands(comment.commands, {
          isPremium: comment.isPremium,
          isOwner: comment.fork === "owner",
        });

        return {
          text: comment.body,
          size,
          position,
          font,
          color,
          duration,
          isFull,
          isEnder,
          isPatissier,
          isCa,
          isInvisible,
          isLive,
        };
      });
  }

  render() {
    return html`<div class="comment-layer">
      ${this.#commentItems.map((item) => {
        const {text, ...data} = item;
        return html`<p class="item" ${data}>${text}</p>`;
      })}
    </div>`;
  }
}
