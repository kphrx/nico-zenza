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

export const durationMsToTimestamp = (durationMs: number) => {
  const datetime = new Date(durationMs);
  const hours = datetime.getUTCHours();
  const minutes = String(datetime.getUTCMinutes()).padStart(2, "0");
  const seconds = String(datetime.getUTCSeconds()).padStart(2, "0");
  return hours > 0
    ? `${String(hours).padStart(2, "0")}:${minutes}:${seconds}`
    : `${minutes}:${seconds}`;
};

export const durationToTimestamp = (duration: number) => {
  return durationMsToTimestamp(duration * 1000);
};
