import {rollupConfig} from "@nico-zenza/build-util";

export default rollupConfig({
  useDecorator: true,
  externals: {
    esModules: [
      {moduleName: "hls.js"},
      {moduleName: "lit"},
      {moduleName: "lit/decorators.js"},
      {moduleName: "lit/directives/class-map.js"},
      {moduleName: "lit/directives/style-map.js"},
      {moduleName: "lit/directives/repeat.js"},
      {moduleName: "@lit/task"},
      {moduleName: "@lit/context"},
    ],
  },
});
