import {rollupConfig} from "@nico-zenza/build-util";

export default rollupConfig({
  useDecorator: true,
  externals: {
    cjsModules: [{moduleName: "hls.js", variableName: "Hls"}],
    esModules: [
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
