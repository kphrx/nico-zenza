import {LitElement, html} from "lit";
import {customElement, state} from "lit/decorators.js";

import sheet from "./switcher.css" with {type: "css"};

const TAG_NAME = "zenza-watch-player-info-panel-switcher";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerInfoPanelSwitcher<string>;
  }
}

@customElement(TAG_NAME)
export class PlayerInfoPanelSwitcher<T extends string> extends LitElement {
  static styles = sheet;

  @state()
  accessor tabs: {id: T; name: string}[];

  @state()
  accessor selectedTab: T;

  #switcher: (current: T, previous: T) => void;

  #selectTab(id: T) {
    return (ev: Event) => {
      ev.preventDefault();
      if (id === this.selectedTab) {
        return;
      }

      this.#switcher(id, this.selectedTab);
      this.selectedTab = id;
    };
  }

  constructor(
    panels: {id: T; name: string}[],
    switcher: (current: T, previous: T) => void,
  ) {
    super();

    this.selectedTab = panels[0].id;
    this.tabs = panels.map((panel) => ({...panel}));
    this.#switcher = switcher;
    this.role = "tablist";
    this.ariaLabel = "ZenzaWatch player info panel tabs";
  }

  render() {
    return this.tabs.map((tab, index) => {
      return html`<span
        role="tab"
        aria-selected=${tab.id === this.selectedTab}
        aria-controls="zenza-player-info-${tab.id}-panel"
        id="zenza-player-info-${tab.id}-tab"
        tabindex=${index === 0 ? 0 : -1}
        @click=${this.#selectTab(tab.id)}
        >${tab.name}</span
      >`;
    });
  }
}
