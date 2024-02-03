import {LitElement, html} from "lit";
import {customElement, state} from "lit/decorators";
import {consume} from "@lit/context";
import {styleMap} from "lit/directives/style-map";

import {watchDataContext} from "@/contexts/watch-data-context";
import type {WatchDataContext} from "@/contexts/watch-data-context";
import {durationToTimestamp} from "@/utils";
import {createCustomEvent} from "@/event";

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
  accessor seekPosition: number | undefined;

  @state()
  accessor bufferedStart: number = 0;

  @state()
  accessor bufferedEnd: number = 0;

  #updateTotalDuration = (
    ev: GlobalEventHandlersEventMap["zenzawatch:updateTotalDuration"],
  ) => {
    this.totalDuration = ev.detail.duration;
  };

  #updateCurrentPosition = (
    ev: GlobalEventHandlersEventMap["zenzawatch:updateCurrentPosition"],
  ) => {
    this.currentPosition = ev.detail.vpos;
  };

  #updateBuffered = (
    ev: GlobalEventHandlersEventMap["zenzawatch:updateBuffered"],
  ) => {
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

  #seeking = (ev: PointerEvent, end: boolean = false) => {
    const target = ev.target as HTMLDivElement | null;
    if (target == null) {
      return;
    }
    const {width} = target.getBoundingClientRect();
    const rectPosition = Math.min(ev.clientX, width) / width;

    const vpos =
      rectPosition *
      Math.max(this.totalDuration, this.watchData?.video.duration ?? 0);
    this.seekPosition = vpos;
    window.dispatchEvent(
      createCustomEvent("zenzawatch:seeking", {detail: {vpos}}),
    );

    if (end) {
      this.currentPosition = this.seekPosition;
      window.dispatchEvent(
        createCustomEvent("zenzawatch:seeked", {detail: {playing: true}}),
      );
    }
  };

  #startSeeking = (ev: PointerEvent) => {
    const target = ev.target as HTMLDivElement | null;
    if (target == null || ev.button !== 0) {
      return;
    }

    target.addEventListener("pointermove", this.#seeking);
    target.setPointerCapture(ev.pointerId);
    this.#seeking(ev);
    target.classList.add("seeking");
  };

  #endSeeking = (ev: PointerEvent) => {
    const target = ev.target as HTMLDivElement | null;
    if (target == null || ev.button !== 0) {
      return;
    }

    target.removeEventListener("pointermove", this.#seeking);
    target.releasePointerCapture(ev.pointerId);
    this.#seeking(ev, true);
    target.classList.remove("seeking");
    this.seekPosition = undefined;
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
        @pointerdown=${this.#startSeeking}
        @pointerup=${this.#endSeeking}
        class="seekbar"
        style=${styleMap({
          "--total-duration": Math.max(
            this.totalDuration,
            this.watchData?.video.duration ?? 0,
          ),
          "--position": this.currentPosition,
          "--seek-position": this.seekPosition,
          "--buffered-start": this.bufferedStart,
          "--buffered-end": this.bufferedEnd,
        })}></div>
      <div class="duration">
        <span class="current-position">
          ${durationToTimestamp(this.seekPosition ?? this.currentPosition)}
        </span>
        /
        <span class="duration">
          ${durationToTimestamp(this.watchData?.video.duration ?? 0)}
        </span>
      </div>
    `;
  }
}
