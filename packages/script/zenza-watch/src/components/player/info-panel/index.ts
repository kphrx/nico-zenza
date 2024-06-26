import {LitElement, html} from "lit";
import {customElement} from "lit/decorators.js";

import {PlayerInfoPanelSwitcher} from "./switcher";
import {PlayerInfoPanelVideoInfoTab} from "./video-info";
import {PlayerInfoPanelCommentsTab} from "./comments";

import sheet from "./style.css" with {type: "css"};

const TAG_NAME = "zenza-watch-player-info-panel";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlayerInfoPanel;
  }
}

@customElement(TAG_NAME)
export class PlayerInfoPanel extends LitElement {
  static styles = sheet;

  #switcher = new PlayerInfoPanelSwitcher(
    [
      {id: "video-info", name: "動画情報"},
      {id: "comments", name: "コメント"},
    ],
    (current, previous) => {
      switch (current) {
        case "video-info":
          this.#videoInfoTab.hidden = false;
          break;
        case "comments":
          this.#commentsTab.hidden = false;
          break;
      }

      switch (previous) {
        case "video-info":
          this.#videoInfoTab.hidden = true;
          break;
        case "comments":
          this.#commentsTab.hidden = true;
          break;
      }
    },
  );
  #videoInfoTab = new PlayerInfoPanelVideoInfoTab();
  #commentsTab = new PlayerInfoPanelCommentsTab();

  constructor() {
    super();

    this.#commentsTab.hidden = true;
  }

  render() {
    return [
      this.#switcher,
      html`<div class="info-panel">
        ${[this.#videoInfoTab, this.#commentsTab]}
      </div>`,
    ];
  }
}
