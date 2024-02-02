declare global {
  interface GlobalEventHandlersEventMap {
    "zenzawatch:playeropen": CustomEvent<{videoId: string}>;
    "zenzawatch:updateTotalDuration": CustomEvent<{duration: number}>;
    "zenzawatch:updateCurrentPosition": CustomEvent<{vpos: number}>;
    "zenzawatch:updateBuffered": CustomEvent<{buffered: IterableTimeRanges}>;
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
