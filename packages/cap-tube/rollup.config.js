/* eslint-env node */
import {env} from "node:process";
import {rollupConfig} from "build-util";
import pkg from "./package.json" with {type: "json"};

const filename = env.npm_package_name.split("/").pop();
const version = env.npm_package_version;

const {
  description,
  license,
  author,
  bugs: {url: tracker},
  homepage,
} = pkg;

export default rollupConfig({
  filename,
  version,
  description,
  license,
  author,
  tracker,
  homepage,
});
