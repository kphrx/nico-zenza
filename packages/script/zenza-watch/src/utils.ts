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

  return (durationMs: number, isThumbnail = false) => {
    const p = dateTimeFormat.formatToParts(new Date(durationMs)).reduce<
      Partial<{
        [key in Intl.DateTimeFormatPartTypes]: Intl.DateTimeFormatPart["value"];
      }>
    >((acc, cur) => {
      acc[cur.type] = cur.value;
      return acc;
    }, {});
    p.day ??= "01";
    p.hour ??= "00";
    p.minute ??= "00";
    p.second ??= "00";

    const days = Number(p.day) - 1;
    const hours = Number(p.hour) + 24 * days;
    const minutes = Number(p.minute);

    if (!isThumbnail) {
      return `${(minutes + 60 * hours).toString().padStart(2, "0")}:${p.second}`;
    }

    if (hours > 0) {
      return `${hours.toString()}:${p.minute}:${p.second}`;
    }
    return `${minutes.toString()}:${p.second}`;
  };
})();

export const durationToTimestamp = (duration: number, isThumbnail = false) => {
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
    p.year ??= "0";
    p.month ??= "01";
    p.day ??= "01";
    p.hour ??= "00";
    p.minute ??= "00";
    p.second ??= "00";

    return `${p.year}/${p.month}/${p.day} ${p.hour}:${p.minute}:${p.second}`;
  };
})();
