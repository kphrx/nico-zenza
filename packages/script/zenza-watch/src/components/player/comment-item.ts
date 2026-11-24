import {LitElement, html} from "lit";
import {customElement, property, state} from "lit/decorators.js";
import {styleMap} from "lit/directives/style-map.js";
import {classMap} from "lit/directives/class-map.js";

import sheet from "./comment-item.css" with {type: "css"};

const TAG_NAME = "zenza-watch-comment-item";

const POSITION_CLASS = {
  ue: false,
  naka: false,
  shita: false,
};

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

  @state()
  accessor currentTime = 0;

  @state()
  accessor startTime = 0;

  @property({type: Number, attribute: "comment-id"})
  accessor uniqueId!: number;

  @property({type: Number, attribute: "vpos-ms"})
  accessor vposMs!: number;

  @property({attribute: false})
  accessor commands!: CommentCommands;

  @property({attribute: false})
  accessor defaultCommands: BaseStyleCommands = {
    size: "medium",
    position: "naka",
    duration: 4000,
    color: "#ffffff",
  };

  get #positionClass() {
    switch (this.commands.position ?? this.defaultCommands.position) {
      case "ue":
        return {...POSITION_CLASS, ue: true};
      case "naka":
        return {...POSITION_CLASS, naka: true};
      case "shita":
        return {...POSITION_CLASS, shita: true};
    }
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

  get #duration() {
    return this.commands.duration ?? this.defaultCommands.duration;
  }

  get #visible() {
    const currentTime = this.currentTime * 1000;
    const start = this.vposMs + 1000;
    const end = start + this.#duration;
    return start <= currentTime && currentTime <= end;
  }

  get #color() {
    return this.commands.color ?? this.defaultCommands.color;
  }

  #onPlaying = () => {
    this.classList.toggle("playing", true);
  };

  #onPausing = () => {
    this.classList.toggle("playing", false);
  };

  #onUpdateCurrentPosition = (
    ev: GlobalEventHandlersEventMap["zenzawatch:updateCurrentPosition"],
  ) => {
    this.currentTime = ev.detail;
  };

  #onSeeking = (ev: GlobalEventHandlersEventMap["zenzawatch:seeking"]) => {
    this.startTime = ev.detail;
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("zenzawatch:playing", this.#onPlaying);
    window.addEventListener("zenzawatch:pausing", this.#onPausing);
    window.addEventListener(
      "zenzawatch:updateCurrentPosition",
      this.#onUpdateCurrentPosition,
    );
    window.addEventListener("zenzawatch:seeking", this.#onSeeking);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("zenzawatch:playing", this.#onPlaying);
    window.removeEventListener("zenzawatch:pausing", this.#onPausing);
    window.removeEventListener(
      "zenzawatch:updateCurrentPosition",
      this.#onUpdateCurrentPosition,
    );
    window.removeEventListener("zenzawatch:seeking", this.#onSeeking);
  }

  render() {
    return html`
      <style>
        :host {
          --duration: ${this.#duration}ms;
          --delay: calc(${this.vposMs}ms - ${this.startTime}s);
        }
      </style>
      <p
        class=${classMap({
          ...this.#fontClass,
          ...this.#sizeClass,
          ...this.#positionClass,
          visible: this.#visible,
        })}
        style=${styleMap({color: this.#color})}>
        <slot></slot>
      </p>
    `;
  }
}
