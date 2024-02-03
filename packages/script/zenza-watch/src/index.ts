import "./meta.js?userscript-metadata";
import main from "./main";

if (window.top === window) {
  main();
}
