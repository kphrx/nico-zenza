import {LeftHoverMenu, HoverMenuButton} from "./components/hover-menu";
import {createCustomEvent} from "./event";
import {PlayerDialog} from "./components/player/dialog";
import {computeBaseZIndex} from "./utils";

export default function main() {
  console.log(
    "userscript manager:",
    `${GM_info.scriptHandler}@${GM_info.version}`,
  );
  console.log("script:", `${GM_info.script.name}@${GM_info.script.version}`);

  document.body.style.setProperty("--zenza-base-z-index", computeBaseZIndex());

  document.body.appendChild(new PlayerDialog());

  document.body
    .appendChild(new LeftHoverMenu())
    .appendChild(
      new HoverMenuButton("Zen", (_, videoId) => {
        dispatchEvent(createCustomEvent("zenzawatch:playeropen", {videoId}));
      }),
    )
    .setAttribute("slot", "menu");

  GM_addStyle(`:root:has(zenza-watch-player-dialog[open]) {
    overflow: hidden;
  }`);
}
