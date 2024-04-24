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
  useDecorator: true,
  externals: {
    objects: {
      "hls.js": "Hls",
    },
    esmodules: [
      {name: "lit", url: "https://esm.run/lit@^3.1.1"},
      {
        name: "lit/decorators.js",
        url: "https://esm.run/lit@^3.1.1/decorators.js",
      },
      {
        name: "lit/directives/class-map.js",
        url: "https://esm.run/lit@^3.1.1/directives/class-map.js",
      },
      {
        name: "lit/directives/style-map.js",
        url: "https://esm.run/lit@^3.1.1/directives/style-map.js",
      },
      {
        name: "lit/directives/repeat.js",
        url: "https://esm.run/lit@^3.1.1/directives/repeat.js",
      },
      {name: "@lit/task", url: "https://esm.run/@lit/task@^1.0.0"},
      {name: "@lit/context", url: "https://esm.run/@lit/context@^1.1.0"},
    ],
  },
});
