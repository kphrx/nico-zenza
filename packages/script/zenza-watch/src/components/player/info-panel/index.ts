import {LitElement, html} from "lit";
import {customElement} from "lit/decorators";
import type {WatchV3Response} from "../watch-data";
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
    (id) => {
      switch (id) {
        case "video-info":
          this.#videoInfoTab.hidden = false;
          this.#commentsTab.hidden = true;
          break;
        case "comments":
          this.#videoInfoTab.hidden = true;
          this.#commentsTab.hidden = false;
          break;
      }
    },
  );
  #videoInfoTab = new PlayerInfoPanelVideoInfoTab();
  #commentsTab = new PlayerInfoPanelCommentsTab();

  init(watchData: WatchV3Response) {
    this.#videoInfoTab.init(watchData);
    this.#commentsTab.init(watchData);
  }

  reset() {
    this.#videoInfoTab.reset();
    this.#commentsTab.reset();
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
