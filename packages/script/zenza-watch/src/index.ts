import "./meta.js?userscript-metadata";
import main from "./main";
import frame from "./frame";

if (window.top === window) {
  main();
} else {
  frame();
}
