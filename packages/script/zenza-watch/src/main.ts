import {LeftHoverMenu} from "./components/hover-menu";
import {HoverMenuButton} from "./components/hover-menu-button";
import {startLinkHoverObserver} from "./event-observer";

console.log(
  "userscript manager:",
  `${GM_info.scriptHandler}@${GM_info.version}`,
);
console.log("script:", `${GM_info.script.name}@${GM_info.script.version}`);

document.body
  .appendChild(new LeftHoverMenu())
  .appendChild(
    new HoverMenuButton("Zen", (_, videoId) => {
      if (videoId === "") {
        return;
      }

      alert(videoId);
    }),
  )
  .setAttribute("slot", "menu");

startLinkHoverObserver();
