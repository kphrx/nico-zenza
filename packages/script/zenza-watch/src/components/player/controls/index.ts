import {LitElement, html, nothing, svg} from "lit";
import {customElement, state} from "lit/decorators.js";
import {consume} from "@lit/context";
import {classMap} from "lit/directives/class-map.js";
import {styleMap} from "lit/directives/style-map.js";

import {watchDataContext} from "@/contexts/watch-data-context";
import type {WatchDataContext} from "@/contexts/watch-data-context";
import {durationToTimestamp} from "@/utils";
import {createCustomEvent} from "@/event";

import sheet from "./style.css" with {type: "css"};

/**
 * # compute svg image
 *
 * ## `playButton` and `pauseButton`
 *
 * ```ts
 * import {html} from "lit";
 * import {SQRT_3, playButton, pauseButton} from "./svg";
 *
 * // ...
 *
 * html`<div
 *   @click=${this.#playOrPause}
 *   class="playControl"
 *   style=${styleMap({"--sqrt3": SQRT_3})}>
 *   ${this.paused
 *     ? playButton
 *     : pauseButton}
 * </div>`
 * ```
 *
 * instead of:
 *
 * ```ts
 * import {html, svg} from "lit";
 *
 * // ...
 *
 * html`<div
 *   @click=${this.#playOrPause}
 *   class="playControl"
 *   style=${styleMap({"--sqrt3": 1.732050807568877})}>
 *   <svg
 *     xmlns="http://www.w3.org/2000/svg"
 *     viewBox="0 0 17.32050807568877 20">
 *     ${this.paused
 *       ? svg`<path fill="currentColor" d="M0,0 V20 L17.32050807568877,10 Z"></path>`
 *       : [
 *           svg`<path fill="currentColor" d="M0,0 V20 H5.773502691896257 V0 Z"></path>`,
 *           svg`<path fill="currentColor" d="M17.32050807568877,0 V20 H11.547005383792513 V0 Z"></path>`,
 *         ]}
 *   </svg>
 * </div>`
 * ```
 *
 * ## `speakerButton`
 *
 * ```ts
 * import {html} from "lit";
 * import {SPEAKER_BUTTON_ASPECT, speakerButton} from "./svg";
 *
 * // ...
 *
 * html`<div
 *   @click=${this.#mute}
 *   class="mute"
 *   style=${styleMap({"--speaker-aspect": SPEAKER_BUTTON_ASPECT})}>
 *   ${speakerButton(Math.min(Math.floor(this.currentVolume / 25), 3), this.muted)}
 * </div>`
 * ```
 *
 * instead of:
 *
 * ```ts
 * import {html, nothing, svg} from "lit";
 *
 * // ...
 *
 * html`<div
 *   @click=${this.#mute}
 *   class="mute"
 *   style=${styleMap({"--speaker-aspect": 0.9515544456622768})}>
 *   <svg
 *     xmlns="http://www.w3.org/2000/svg"
 *     viewBox="0 0 28.546633369868303 30">
 *     ${svg`<path fill="currentColor" d="M0,11.5 H6.06217782649107 L12,8.07179676972449 V21.92820323027551 L6.06217782649107,18.5 H0 Z"></path>`}
 *     ${this.muted || this.currentVolume >= 25
 *       ? svg`<path fill="transparent" stroke="currentColor" stroke-width=2 d="M14.237604307034013,11.5 Q17.26869322027955,15 14.237604307034013,18.5"></path>`
 *       : nothing}
 *     ${this.muted || this.currentVolume >= 50
 *       ? svg`<path fill="transparent" stroke="currentColor" stroke-width=2 d="M18.118802153517006,8 Q24.180979980008075,15 18.118802153517006,22"></path>`
 *       : nothing}
 *     ${this.muted || this.currentVolume >= 75
 *       ? svg`<path fill="transparent" stroke="currentColor" stroke-width=2 d="M22,4.5 Q31.093266739736606,15 22,25.5"></path>`
 *       : nothing}
 *     ${this.muted
 *       ? svg`<path fill="transparent" stroke="currentColor" stroke-width=2 d="M1,3.453366630131697 L27.546633369868303,27.546633369868303"></path>`
 *       : nothing}
 *   </svg>
 * </div>`
 * ```
 */

type PlaybackRate = `${number}.${number}` | `${number}`;
const PLAYBACK_RATE = [
  "10",
  "5",
  "4",
  "3",
  "2",
  "1.5",
  "1.25",
  "1",
  "0.75",
  "0.5",
  "0.25",
  "0.1",
] as const;

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
  accessor seeking = false;

  @state()
  accessor totalDuration = 0;

  @state()
  accessor currentPosition = 0;

  @state()
  accessor seekPosition: number | undefined;

  @state()
  accessor bufferedStart = 0;

  @state()
  accessor bufferedEnd = 0;

  @state()
  accessor paused = false;

  @state()
  accessor playbackRate: PlaybackRate = "1";

  @state()
  accessor openedRateOptions = false;

  @state()
  accessor muted = false;

  @state()
  accessor changingVolume = false;

  @state()
  accessor currentVolume = 100;

  #beforeVolume = 100;

  get #prevented() {
    return this.seeking || this.changingVolume;
  }

  #updateTotalDuration = (
    ev: GlobalEventHandlersEventMap["zenzawatch:updateTotalDuration"],
  ) => {
    this.totalDuration = ev.detail;
  };

  #updateCurrentPosition = (
    ev: GlobalEventHandlersEventMap["zenzawatch:updateCurrentPosition"],
  ) => {
    this.currentPosition = ev.detail;
  };

  #updateBuffered = (
    ev: GlobalEventHandlersEventMap["zenzawatch:updateBuffered"],
  ) => {
    const buffered = ev.detail;
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

  #seeking = (ev: PointerEvent, end = false) => {
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

    this.seekPosition =
      rectPosition *
      Math.max(this.totalDuration, this.watchData?.video.duration ?? 0);
    window.dispatchEvent(
      createCustomEvent("zenzawatch:seeking", this.seekPosition),
    );

    if (end) {
      this.currentPosition = this.seekPosition;
      window.dispatchEvent(
        createCustomEvent("zenzawatch:seeked", {playing: !this.paused}),
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
    setTimeout(() => {
      this.seeking = false;
      this.seekPosition = undefined;
    }, 50);
  };

  #playOrPause = (ev: MouseEvent) => {
    if (ev.defaultPrevented || this.#prevented) {
      ev.preventDefault();
      return;
    }

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

  #rateOptions = (ev: MouseEvent) => {
    if (ev.defaultPrevented || this.#prevented) {
      ev.preventDefault();
      return;
    }

    this.openedRateOptions = !this.openedRateOptions;
  };

  #changeRate = (ev: MouseEvent) => {
    ev.preventDefault();
    this.playbackRate =
      ((ev.target as HTMLDivElement | null)?.dataset.value as
        | PlaybackRate
        | undefined) ?? "1";
    window.dispatchEvent(
      createCustomEvent(
        "zenzawatch:changePlaybackRate",
        parseFloat(this.playbackRate),
      ),
    );
  };

  #mute = (ev: MouseEvent) => {
    if (ev.defaultPrevented || this.#prevented) {
      ev.preventDefault();
      return;
    }

    this.currentVolume = this.muted ? this.#beforeVolume : 0;
    this.muted = !this.muted;
    window.dispatchEvent(
      createCustomEvent(`zenzawatch:${this.muted ? "mute" : "unmute"}`),
    );
  };

  #changeVolume = (ev: PointerEvent) => {
    const target = ev.target as HTMLDivElement | null;
    if (target == null) {
      return;
    }

    const {left, width} = target.getBoundingClientRect();
    const rectPosition =
      Math.min(Math.max(ev.clientX, left) - left, width) / width;

    this.currentVolume = Math.floor(rectPosition * 100);
    this.muted = this.currentVolume === 0;
    window.dispatchEvent(
      createCustomEvent("zenzawatch:changeVolume", this.currentVolume),
    );
  };

  #startChangingVolume = (ev: PointerEvent) => {
    const target = ev.target as HTMLDivElement | null;
    if (target == null || ev.button !== 0) {
      return;
    }

    if (this.muted) {
      window.dispatchEvent(createCustomEvent("zenzawatch:unmute"));
    }
    target.addEventListener("pointermove", this.#changeVolume);
    target.setPointerCapture(ev.pointerId);
    this.#changeVolume(ev);
    this.changingVolume = true;
  };

  #endChangingVolume = (ev: PointerEvent) => {
    const target = ev.target as HTMLDivElement | null;
    if (target == null || ev.button !== 0) {
      return;
    }

    target.removeEventListener("pointermove", this.#changeVolume);
    target.releasePointerCapture(ev.pointerId);
    this.#changeVolume(ev);
    if (this.currentVolume !== 0) {
      this.#beforeVolume = this.currentVolume;
    } else {
      window.dispatchEvent(createCustomEvent("zenzawatch:mute"));
      window.dispatchEvent(
        createCustomEvent("zenzawatch:changeVolume", this.#beforeVolume),
      );
    }
    setTimeout(() => {
      this.changingVolume = false;
    }, 50);
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
            <div
              @click=${this.#rateOptions}
              class="playbackRate"
              ?open=${this.openedRateOptions}>
              <p class="current">x${this.playbackRate}</p>
              <datalist>
                ${PLAYBACK_RATE.map((rate) => {
                  return html`<div
                    @click=${this.#changeRate}
                    data-value=${rate}
                    ?selected=${rate === this.playbackRate}>
                    ${rate === "1" ? "標準速度(x1)" : `${rate}倍`}
                  </div>`;
                })}
              </datalist>
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
          <div class="sound">
            <div
              @click=${this.#mute}
              class="mute"
              style=${styleMap({"--speaker-aspect": 0.9515544456622768})}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 28.546633369868303 30">
                ${svg`<path fill="currentColor" d="M0,11.5 H6.06217782649107 L12,8.07179676972449 V21.92820323027551 L6.06217782649107,18.5 H0 Z"></path>`}
                ${this.muted || this.currentVolume >= 25
                  ? svg`<path fill="transparent" stroke="currentColor" stroke-width=2 d="M14.237604307034013,11.5 Q17.26869322027955,15 14.237604307034013,18.5"></path>`
                  : nothing}
                ${this.muted || this.currentVolume >= 50
                  ? svg`<path fill="transparent" stroke="currentColor" stroke-width=2 d="M18.118802153517006,8 Q24.180979980008075,15 18.118802153517006,22"></path>`
                  : nothing}
                ${this.muted || this.currentVolume >= 75
                  ? svg`<path fill="transparent" stroke="currentColor" stroke-width=2 d="M22,4.5 Q31.093266739736606,15 22,25.5"></path>`
                  : nothing}
                ${this.muted
                  ? svg`<path fill="transparent" stroke="currentColor" stroke-width=2 d="M1,3.453366630131697 L27.546633369868303,27.546633369868303"></path>`
                  : nothing}
              </svg>
            </div>
            <div
              @pointerdown=${this.#startChangingVolume}
              @pointerup=${this.#endChangingVolume}
              class=${classMap({
                soundbar: true,
                changing: this.changingVolume,
              })}
              data-value=${this.currentVolume}
              style=${styleMap({"--current-volume": this.currentVolume})}></div>
          </div>
        </div>

        <div class="right"></div>
      </div>
    `;
  }
}
