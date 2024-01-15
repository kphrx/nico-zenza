/* eslint-env node */
import {rollupConfig} from "build-util";
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
  useDecorator: true,
  externals: {
    lit: 'await import("https://esm.run/lit@^3.1.1")',
    "lit/decorators.js":
      'await import("https://esm.run/lit@^3.1.1/decorators.js")',
  },
});
