import "./meta.js?userscript-metadata";
import main from "./main";
import loader from "./loader";

if (window.top === window) {
  main();
} else {
  loader();
}
