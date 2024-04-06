/* eslint-env node */
import {env} from "node:process";

import {defineConfig} from "rollup";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import importCss from "rollup-plugin-import-css";
import userscript from "rollup-plugin-userscript";

function addSuffix(filename: string, version: string) {
  if (env.NODE_ENV !== "production") {
    const now = new Date().getTime();

    return {
      filename: `${filename}+dev`,
      version:
        version?.indexOf("-") !== -1
          ? `${version}.dev.${now}`
          : `${version}-dev.${now}`,
    };
  }

  return {filename, version};
}

interface ESModule {
  name: string;
  objectName?: string;
  url: string;
}

function bannerAndFooter(esmodules: ESModule[] = []) {
  let banner: string, objects: {[key: string]: string} | undefined;

  if (esmodules.length > 0) {
    const esms = esmodules.map((m) => ({
      ...m,
      objectName: m.objectName ?? m.name.replaceAll(/@|\/|-|\./g, "_"),
    }));
    banner = `(async () => {
const [${esms.map((m) => m.objectName).join(", ")}] = await Promise.all([
  ${esms.map((m) => `import("${m.url}")`).join(",\n  ")}
]);`;
    objects = Object.fromEntries(esms.map((m) => [m.name, m.objectName]));
  } else {
    banner = "(async () => {";
  }

  return {
    banner,
    footer: "})();",
    objects,
  };
}

interface Options {
  filename: string;
  version: string;
  description?: string;
  license?: string;
  author?: string;
  tracker?: string;
  homepage?: string;
  useDecorator?: boolean;
  externals?: {
    objects?: {[key: string]: string};
    esmodules?: ESModule[];
  };
}

export function rollupConfig({
  filename: name,
  version: ver,
  description,
  license,
  author,
  tracker,
  homepage,
  useDecorator = false,
  externals,
}: Options) {
  const extensions = [".ts", ".tsx", ".mjs", ".js", ".jsx"];
  const {filename, version} = addSuffix(name, ver);

  const {banner, footer, objects} = bannerAndFooter(externals?.esmodules);

  let globals: {[key: string]: string} | undefined;
  if (externals?.objects != null || objects != null) {
    globals = {...externals?.objects, ...objects};
  }

  const external = [...Object.keys(globals ?? {}), /node_modules/];

  return defineConfig({
    input: "src/index.ts",
    output: {
      file: `dist/${filename}.user.js`,
      format: "iife",
      banner,
      footer,
      indent: false,
      sourcemap: false,
      globals,
    },
    external,
    plugins: [
      babel({
        babelrc: false,
        babelHelpers: "bundled",
        presets: [
          [
            "@babel/env",
            {
              modules: false,
              targets: "> 0.5%, Firefox ESR, not dead",
              shippedProposals: true,
            },
          ],
          ["@babel/typescript", {allowDeclareFields: true}],
        ],
        plugins: [
          useDecorator && ["@babel/proposal-decorators", {version: "2023-05"}],
          [
            "babel-plugin-tsconfig-paths",
            {
              relative: true,
              extensions,
              rootDir: ".",
              tsconfig: "./tsconfig.json",
            },
          ],
        ].filter((x) => x),
        exclude: "node_modules/**",
        extensions,
      }),
      nodeResolve({browser: false, extensions}),
      importCss({modules: true, minify: true}),
      userscript((meta) => {
        return meta
          .replace("{{version}}", version)
          .replace("{{description}}", description ?? "-")
          .replace("{{license}}", license ?? "-")
          .replace("{{author}}", author ?? "-")
          .replace("{{tracker}}", tracker ?? "-")
          .replace("{{homepage}}", homepage ?? "-");
      }),
    ],
  });
}
