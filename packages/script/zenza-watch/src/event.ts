declare global {
  interface GlobalEventHandlersEventMap {
    "zenzawatch:playeropen": CustomEvent<{videoId: string}>;

    "zenzawatch:updateTotalDuration": CustomEvent<{duration: number}>;
    "zenzawatch:updateCurrentPosition": CustomEvent<{vpos: number}>;
    "zenzawatch:updateBuffered": CustomEvent<{buffered: IterableTimeRanges}>;

    "zenzawatch:seeking": CustomEvent<{vpos: number}>;
    "zenzawatch:seeked": CustomEvent<{playing: boolean}>;

    "zenzawatch:play": CustomEvent<void>;
    "zenzawatch:pause": CustomEvent<void>;
    "zenzawatch:playing": CustomEvent<void>;
    "zenzawatch:pausing": CustomEvent<void>;

    "zenzawatch:mute": CustomEvent<void>;
    "zenzawatch:unmute": CustomEvent<void>;
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

export const createCustomEvent = <K extends keyof GlobalEventHandlersEventMap>(
  type: K,
  eventInitDict?: CustomEventInit<
    GlobalEventHandlersEventMap[K] extends CustomEvent<infer T> ? T : never
  >,
) => new CustomEvent(type, eventInitDict);
