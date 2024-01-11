/* eslint-env node */
import {rollupConfig} from "build-util";
import pkg from "./package.json" with {type: "json"};

const {
  description,
  license,
  author,
  bugs: {url: tracker},
  homepage,
} = pkg;

export default rollupConfig({
  filename: process.env.npm_package_name.split("/").pop(),
  version: process.env.npm_package_version,
  description,
  license,
  author,
  tracker,
  homepage,
});
