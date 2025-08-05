import {LitElement, html} from "lit";
import {customElement} from "lit/decorators.js";
import {repeat} from "lit/directives/repeat.js";
import {consume} from "@lit/context";

import {commentContext} from "@/contexts/comment-context";
import type {CommentContext} from "@/contexts/comment-context";

import "./comment-item";
import type {CommentCommands} from "./comment-item";

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
    const parsedCommands: CommentCommands = {
      isFull: false,
      isEnder: false,
      isPatissier: false,
      isCa: false,
      isInvisible: false,
      isLive: false,
    };

    for (const cmd of commands) {
      if (this.#isNgCommand(cmd)) {
        continue;
      }

      if (hasSetCommand(COMMANDS.SIZE, cmd)) {
        parsedCommands.size ??= cmd;
        continue;
      }

      if (hasSetCommand(COMMANDS.POSITION, cmd)) {
        parsedCommands.position ??= cmd;
        parsedCommands.duration ??= cmd === "naka" ? 4000 : 2900;
        continue;
      }

      if (hasSetCommand(COMMANDS.FONT, cmd)) {
        parsedCommands.font ??= cmd;
        continue;
      }

      if (hasRecordCommand(COMMANDS.COLOR, cmd)) {
        parsedCommands.color ??= COMMANDS.COLOR[cmd];
        continue;
      }

      if (hasRecordCommand(COMMANDS.COLOR_PREMIUM, cmd)) {
        if (isPremium) {
          parsedCommands.color ??= COMMANDS.COLOR_PREMIUM[cmd];
        }
        continue;
      }

      switch (cmd) {
        // style
        case "full":
          parsedCommands.isFull = true;
          continue;
        case "ender":
          parsedCommands.isEnder = true;
          continue;

        // memory
        case "patissier":
          parsedCommands.isPatissier = true;
          continue;
        case "ca":
          parsedCommands.isCa = true;
          continue;
        case "invisible":
          parsedCommands.isInvisible = true;
          continue;

        // other
        case "_live":
          parsedCommands.isLive = true;
          continue;
      }

      const colorMatch = /(#[0-9a-f]+)/i.exec(cmd);
      if (colorMatch != null) {
        if (isPremium) {
          parsedCommands.color ??= colorMatch[1];
        }
        continue;
      }

      const durationMatch = /[@＠]([0-9]+)(?:\.(?<decimal>[0-9]+))?/.exec(cmd);
      if (durationMatch != null) {
        if (!isOwner || parsedCommands.duration != null) {
          continue;
        }
        const sec = durationMatch[1];
        const ms = durationMatch.groups?.decimal ?? "0";
        parsedCommands.duration = parseFloat(
          `${sec}${ms.padEnd(3, "0").slice(0, 3)}.${ms.slice(3)}`,
        );
        continue;
      }
    }

    return parsedCommands;
  }

  render() {
    return repeat(
      this.comments,
      (item) => item.id,
      ({body, id, vposMs, commands, isPremium, fork}) => {
        return html`<zenza-comment-item
          comment-id=${id}
          .vpos=${vposMs}
          .commands=${this.#parseCommands(commands, {
            isPremium,
            isOwner: fork === "owner",
          })}
          >${body}</zenza-comment-item
        >`;
      },
    );
  }
}
