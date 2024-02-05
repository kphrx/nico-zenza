declare global {
  interface GlobalEventHandlersEventMap {
    "zenzawatch:playeropen": CustomEvent<{videoId: string}>;

    "zenzawatch:updateTotalDuration": CustomEvent<number>;
    "zenzawatch:updateCurrentPosition": CustomEvent<number>;
    "zenzawatch:updateBuffered": CustomEvent<IterableTimeRanges>;

    "zenzawatch:seeking": CustomEvent<number>;
    "zenzawatch:seeked": CustomEvent<{playing: boolean}>;

    "zenzawatch:play": CustomEvent<void>;
    "zenzawatch:pause": CustomEvent<void>;
    "zenzawatch:playing": CustomEvent<void>;
    "zenzawatch:pausing": CustomEvent<void>;

    "zenzawatch:mute": CustomEvent<void>;
    "zenzawatch:unmute": CustomEvent<void>;

    "zenzawatch:changePlaybackRate": CustomEvent<number>;
  }
}

export type IterableTimeRanges = {
  start: number;
  end: number;
}[];

export const timeRangesToIterable = (
  ranges: TimeRanges,
): IterableTimeRanges => {
  const {length} = ranges;
  return Array.from({length}, (_v, index) => {
    return {
      start: ranges.start(index),
      end: ranges.end(index),
    };
  });
};

export const createCustomEvent = <
  K extends keyof GlobalEventHandlersEventMap,
  T extends GlobalEventHandlersEventMap[K] extends CustomEvent<infer T>
    ? T
    : never,
>(
  type: K,
  ...eventInitDict: T extends undefined | void
    ? [CustomEventInit<T>?]
    : [Omit<CustomEventInit, "detail"> & {detail: T}]
) => new CustomEvent(type, ...eventInitDict);
