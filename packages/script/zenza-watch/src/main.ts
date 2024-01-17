import {LeftHoverMenu, HoverMenuButton} from "./components/hover-menu";
import {PlayerDialog} from "./components/player-dialog";
import {computeBaseZIndex} from "./util";
import {startLinkHoverObserver} from "./event-observer";

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
      if (videoId === "") {
        return;
      }

      dispatchEvent(
        new CustomEvent("zenzawatch:playeropen", {detail: {videoId}}),
      );
    }),
  )
  .setAttribute("slot", "menu");

startLinkHoverObserver();
