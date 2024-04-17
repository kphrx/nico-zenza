import {rollupConfig} from "@nico-zenza/build-util";
import pkg from "./package.json" with {type: "json"};

const {
  name,
  version,
  description,
  license,
  author,
  bugs: {url: tracker},
  homepage,
} = pkg;

const filename = name.split("/")[1];

export default rollupConfig({
  filename,
  version,
  description,
  license,
  author,
  tracker,
  homepage,
});
