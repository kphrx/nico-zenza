import {LitElement, html} from "lit";
import {customElement, property} from "lit/decorators.js";
import {styleMap} from "lit/directives/style-map.js";
import {classMap} from "lit/directives/class-map.js";

import sheet from "./comment-item.css" with {type: "css"};

const TAG_NAME = "zenza-comment-item";

const FONT_CLASS = {
  mincho: false,
  gothic: false,
  defont: false,
  flash: false,
  html5: false,
};

const SIZE_CLASS = {
  small: false,
  medium: false,
  big: false,
};

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerCommentItem;
  }
}

export interface DataProp {
  text: string;
}

export interface BaseStyleCommands {
  size: "small" | "medium" | "big";
  position: "ue" | "shita" | "naka";
  duration: number;
  color: string;
  font?: "mincho" | "gothic" | "defont";
}

export interface ExtendedStyleCommands {
  isFull: boolean;
  isEnder: boolean;
  isPatissier: boolean;
  isCa: boolean;
  isInvisible: boolean;
  isLive: boolean;
}

export type CommentCommands = Partial<BaseStyleCommands> &
  ExtendedStyleCommands;

@customElement(TAG_NAME)
export class PlayerCommentItem extends LitElement {
  static styles = sheet;

  currentTime = 0;

  @property({type: Number, attribute: "comment-id"})
  accessor uniqueId!: number;

  @property({type: Number})
  accessor vpos!: number;

  @property({attribute: false})
  accessor commands!: CommentCommands;

  @property({attribute: false})
  accessor defaultCommands: BaseStyleCommands = {
    size: "medium",
    position: "naka",
    duration: 4000,
    color: "#ffffff",
  };

  get position() {
    return this.commands.position ?? this.defaultCommands.position;
  }

  get #fontClass() {
    switch (this.commands.font) {
      case "mincho":
        return {...FONT_CLASS, mincho: true, html5: true};
      case "gothic":
        return {...FONT_CLASS, gothic: true, html5: true};
      case "defont":
        return {...FONT_CLASS, defont: true, html5: true};
      default:
        return {...FONT_CLASS, flash: true};
    }
  }

  get #sizeClass() {
    switch (this.commands.size ?? this.defaultCommands.size) {
      case "small":
        return {...SIZE_CLASS, small: true};
      case "medium":
        return {...SIZE_CLASS, medium: true};
      case "big":
        return {...SIZE_CLASS, big: true};
    }
  }

  get #visible() {
    const end =
      this.vpos + (this.commands.duration ?? this.defaultCommands.duration);
    return this.vpos <= this.currentTime && this.currentTime <= end;
  }

  get #color() {
    return this.commands.color ?? this.defaultCommands.color;
  }

  render() {
    return html`<p
      class=${classMap({...this.#fontClass, ...this.#sizeClass})}
      ?hidden=${this.#visible}
      style=${styleMap({color: this.#color})}>
      <slot></slot>
    </p>`;
  }
}
