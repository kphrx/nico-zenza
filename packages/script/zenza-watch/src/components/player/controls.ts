import {LitElement, html, svg} from "lit";
import {customElement, state} from "lit/decorators";
import {consume} from "@lit/context";
import {classMap} from "lit/directives/class-map";
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
  accessor seeking: boolean = false;

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

  @state()
  accessor paused: boolean = false;

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

    for (const range of buffered.toReversed()) {
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
    const {paddingLeft, paddingRight} = getComputedStyle(target);
    const left = parseFloat(paddingLeft);
    const width =
      target.getBoundingClientRect().width - left - parseFloat(paddingRight);
    const rectPosition =
      Math.min(Math.max(ev.clientX, left) - left, width) / width;

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
        createCustomEvent("zenzawatch:seeked", {
          detail: {playing: !this.paused},
        }),
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
    this.seeking = true;
  };

  #endSeeking = (ev: PointerEvent) => {
    const target = ev.target as HTMLDivElement | null;
    if (target == null || ev.button !== 0) {
      return;
    }

    target.removeEventListener("pointermove", this.#seeking);
    target.releasePointerCapture(ev.pointerId);
    this.#seeking(ev, true);
    this.seeking = false;
    this.seekPosition = undefined;
  };

  #playOrPause = () => {
    this.paused = !this.paused;
    window.dispatchEvent(
      createCustomEvent(`zenzawatch:${this.paused ? "pause" : "play"}`),
    );
  };

  #play = () => {
    if (this.seeking) {
      return;
    }
    this.paused = false;
  };

  #pause = () => {
    if (this.seeking) {
      return;
    }
    this.paused = true;
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
    window.addEventListener("zenzawatch:playing", this.#play);
    window.addEventListener("zenzawatch:pausing", this.#pause);
  }

  override disconnectedCallback() {
    window.removeEventListener("zenzawatch:playing", this.#play);
    window.removeEventListener("zenzawatch:pausing", this.#pause);
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
        class=${classMap({
          seekbar: true,
          seeking: this.seeking,
        })}
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

      <div class="controlbar">
        <div class="left">
          <span class="version">ver ${GM_info.script.version}</span>
        </div>

        <div class="center">
          <div class="controls">
            <div
              @click=${this.#playOrPause}
              class="playControl"
              style=${styleMap({"--sqrt3": 1.732050807568877})}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 17.32050807568877 20">
                ${this.paused
                  ? svg`<path fill="currentColor" d="M0,0 V20 L17.32050807568877,10 Z"></path>`
                  : [
                      svg`<path fill="currentColor" d="M0,0 V20 H5.773502691896257 V0 Z"></path>`,
                      svg`<path fill="currentColor" d="M17.32050807568877,0 V20 H11.547005383792513 V0 Z"></path>`,
                    ]}
              </svg>
            </div>
          </div>
          <div class="duration">
            <span class="current">
              ${durationToTimestamp(this.seekPosition ?? this.currentPosition)}
            </span>
            /
            <span class="total">
              ${durationToTimestamp(this.watchData?.video.duration ?? 0)}
            </span>
          </div>
        </div>

        <div class="right"></div>
      </div>
    `;
  }
}
