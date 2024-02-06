export const computeBaseZIndex = (() => {
  let commonHeader: HTMLDivElement | null;

  return () => {
    commonHeader ??= document.querySelector("div#CommonHeader");
    if (commonHeader == null) {
      return "5000000";
    }

    return getComputedStyle(commonHeader).zIndex;
  };
})();

export const durationMsToTimestamp = (() => {
  const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
    timeZone: "UTC",
    hourCycle: "h23",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (durationMs: number, isThumbnail: boolean = false) => {
    const p = dateTimeFormat.formatToParts(new Date(durationMs)).reduce<
      Partial<{
        [key in Intl.DateTimeFormatPartTypes]: Intl.DateTimeFormatPart["value"];
      }>
    >((acc, cur) => {
      acc[cur.type] = cur.value;
      return acc;
    }, {});
    const days = Number(p.day ?? 1) - 1;
    const hours = Number(p.hour ?? 0) + 24 * days;

    if (isThumbnail && hours > 0) {
      return `${hours}:${p.minute}:${p.second}`;
    }

    if (isThumbnail) {
      return `${Number(p.minute ?? 0)}:${p.second}`;
    }

    const minutes = Number(p.minute ?? 0) + 60 * hours;
    return `${String(minutes).padStart(2, "0")}:${p.second}`;
  };
})();

export const durationToTimestamp = (
  duration: number,
  isThumbnail: boolean = false,
) => {
  return durationMsToTimestamp(duration * 1000, isThumbnail);
};

export const dateFormatter = (() => {
  const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (date: Date) => {
    const p = dateTimeFormat.formatToParts(date).reduce<
      Partial<{
        [key in Intl.DateTimeFormatPartTypes]: Intl.DateTimeFormatPart["value"];
      }>
    >((acc, cur) => {
      acc[cur.type] = cur.value;
      return acc;
    }, {});

    return `${p.year}/${p.month}/${p.day} ${p.month}:${p.minute}:${p.second}`;
  };
})();
