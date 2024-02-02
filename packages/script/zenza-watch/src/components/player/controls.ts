import {LitElement, html} from "lit";
import {customElement, state} from "lit/decorators";
import {consume} from "@lit/context";
import {styleMap} from "lit/directives/style-map";

import {watchDataContext} from "@/contexts/watch-data-context";
import type {WatchDataContext} from "@/contexts/watch-data-context";
import {durationToTimestamp} from "@/utils";

import sheet from "./controls.css" with {type: "css"};

const TAG_NAME = "zenza-watch-player-controls";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerControls;
  }
}

@customElement(TAG_NAME)
export class PlayerControls extends LitElement {
  static styles = sheet;

  @consume({context: watchDataContext, subscribe: true})
  accessor watchData: WatchDataContext;

  @state()
  accessor totalDuration: number = 0;

  @state()
  accessor currentPosition: number = 0;

  @state()
  accessor bufferedStart: number = 0;

  @state()
  accessor bufferedEnd: number = 0;

  #updateTotalDuration: (
    ev: GlobalEventHandlersEventMap["zenzawatch:updateTotalDuration"],
  ) => void = (ev) => {
    this.totalDuration = Math.floor(ev.detail.duration);
  };

  #updateCurrentPosition: (
    ev: GlobalEventHandlersEventMap["zenzawatch:updateCurrentPosition"],
  ) => void = (ev) => {
    this.currentPosition = Math.floor(ev.detail.vpos);
  };

  #updateBuffered: (
    ev: GlobalEventHandlersEventMap["zenzawatch:updateBuffered"],
  ) => void = (ev) => {
    const {buffered} = ev.detail;
    if (buffered.length === 0) {
      this.bufferedStart = 0;
      this.bufferedEnd = 0;
      return;
    }

    for (const range of buffered) {
      if (range.start >= this.currentPosition) {
        continue;
      }

      this.bufferedStart = range.start;
      this.bufferedEnd = range.end;

      break;
    }
  };

  override connectedCallback() {
    super.connectedCallback();

    window.addEventListener(
      "zenzawatch:updateTotalDuration",
      this.#updateTotalDuration,
    );
    window.addEventListener(
      "zenzawatch:updateCurrentPosition",
      this.#updateCurrentPosition,
    );
    window.addEventListener("zenzawatch:updateBuffered", this.#updateBuffered);
  }

  override disconnectedCallback() {
    window.removeEventListener(
      "zenzawatch:updateBuffered",
      this.#updateBuffered,
    );
    window.removeEventListener(
      "zenzawatch:updateCurrentPosition",
      this.#updateCurrentPosition,
    );
    window.removeEventListener(
      "zenzawatch:updateTotalDuration",
      this.#updateTotalDuration,
    );

    super.disconnectedCallback();
  }

  render() {
    return html`
      <div
        class="seekbar"
        style=${styleMap({
          "--total-duration": String(
            Math.max(this.totalDuration, this.watchData?.video.duration ?? 0),
          ),
          "--position": String(this.currentPosition),
          "--buffered-start": String(this.bufferedStart),
          "--buffered-end": String(this.bufferedEnd),
        })}></div>
      <div class="duration">
        <span class="current-position">
          ${durationToTimestamp(this.currentPosition)}
        </span>
        /
        <span class="duration">
          ${durationToTimestamp(this.watchData?.video.duration ?? 0)}
        </span>
      </div>
    `;
  }
}
