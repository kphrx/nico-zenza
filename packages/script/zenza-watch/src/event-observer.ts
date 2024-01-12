export function startLinkHoverObserver() {
  let currentHoverLink: HTMLAnchorElement | null;

  document.body.addEventListener("mouseover", (ev) => {
    if (ev.target == null) {
      return;
    }

    const target = ev.target as HTMLElement;

    const hoverLink: HTMLAnchorElement | null = target.closest(
      'a[href*="nicovideo.jp/watch/"],a[href*="nico.ms/"]',
    );

    if (hoverLink === currentHoverLink) {
      return;
    }

    if (hoverLink === null) {
      document.addEventListener(
        "zenza:linkmouseleave",
        (ev) => {
          if (ev.defaultPrevented) return;
          currentHoverLink = null;
          document.body.dispatchEvent(new CustomEvent("zenza:linkmouseout"));
        },
        {once: true},
      );

      document.body.dispatchEvent(
        new CustomEvent("zenza:linkmouseleave", {
          detail: target,
          cancelable: true,
          bubbles: true,
        }),
      );

      return;
    }

    currentHoverLink = hoverLink;

    const offset = hoverLink.getBoundingClientRect();

    const position = {
      top: offset.top + window.scrollY,
      bottom: offset.bottom + window.scrollY,
      left: offset.left + window.scrollX,
      right: offset.right + window.scrollX,
      href: hoverLink.href,
    };

    document.body.dispatchEvent(
      new CustomEvent("zenza:linkmouseenter", {detail: position}),
    );
  });
}
