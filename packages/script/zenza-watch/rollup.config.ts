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
    objects: {
      "hls.js": "Hls",
    },
    esmodules: [
      {name: "lit", url: "https://esm.run/lit@^3.1.1"},
      {name: "lit/decorators", url: "https://esm.run/lit@^3.1.1/decorators"},
      {
        name: "lit/directives/class-map",
        url: "https://esm.run/lit@^3.1.1/directives/class-map",
      },
      {
        name: "lit/directives/style-map",
        url: "https://esm.run/lit@^3.1.1/directives/style-map",
      },
      {
        name: "lit/directives/repeat",
        url: "https://esm.run/lit@^3.1.1/directives/repeat",
      },
      {name: "@lit/task", url: "https://esm.run/@lit/task@^1.0.0"},
      {name: "@lit/context", url: "https://esm.run/@lit/context@^1.1.0"},
    ],
  },
});
