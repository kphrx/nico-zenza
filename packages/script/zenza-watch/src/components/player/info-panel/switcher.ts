import {LitElement, html} from "lit";
import {customElement} from "lit/decorators";
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

  #tabs: {id: T; name: string; selected: boolean}[];
  #onSelect: (id: T) => void;

  #selectTab(id: T) {
    for (const tab of this.#tabs) {
      tab.selected = tab.id === id;
    }
    this.#onSelect(id);
    this.requestUpdate();
  }

  constructor(panels: {id: T; name: string}[], onSelect: (id: T) => void) {
    super();

    this.#tabs = panels.map((panel) => ({...panel, selected: false}));
    this.#onSelect = onSelect;
    this.role = "tablist";
    this.ariaLabel = "ZenzaWatch player info panel tabs";
  }

  override connectedCallback() {
    super.connectedCallback();

    this.#tabs[0].selected = true;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    for (const tab of this.#tabs) {
      tab.selected = false;
    }
  }

  render() {
    return this.#tabs.map((tab) => {
      return html`<span
        role="tab"
        aria-selected=${tab.selected}
        aria-controls="zenza-player-info-${tab.id}-panel"
        id="zenza-player-info-${tab.id}-tab"
        tabindex=${tab.selected ? 0 : -1}
        @click=${() => this.#selectTab(tab.id)}
        >${tab.name}</span
      >`;
    });
  }
}
