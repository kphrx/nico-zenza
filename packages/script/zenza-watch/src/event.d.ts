interface GlobalEventHandlersEventMap {
  "zenza:linkmouseenter": CustomEvent<{
    top: number;
    bottom: number;
    left: number;
    right: number;
    href: string;
  }>;
  "zenza:linkmouseout": CustomEvent;
  "zenza:linkmouseleave": CustomEvent<HTMLElement>;
}
