let commonHeader: HTMLDivElement | null;

export function computeBaseZIndex() {
  commonHeader ||= document.querySelector("div#CommonHeader");

  if (commonHeader == null) {
    return "5000000";
  }

  return getComputedStyle(commonHeader).zIndex;
}
