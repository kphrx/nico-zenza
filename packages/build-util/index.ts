/* eslint-env node */
import {env} from "node:process";
import {defineConfig} from "rollup";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import userscript from "rollup-plugin-userscript";

function addSuffix(filename?: string, version?: string) {
  if (env.NODE_ENV !== "production") {
    const now = new Date().getTime();

    return {
      name: `${filename}+dev`,
      ver:
        version?.indexOf("-") !== -1
          ? `${version}.dev.${now}`
          : `${version}-dev.${now}`,
    };
  }

  return {
    name: filename,
    ver: version,
  };
}

interface Options {
  filename: string;
  version: string;
  description: string;
  license: string;
  author: string;
  tracker: string;
  homepage: string;
  externals: {[key: string]: string};
}

export function rollupConfig({
  filename,
  version,
  description,
  license,
  author,
  tracker,
  homepage,
  externals = {},
}: Partial<Options> = {}) {
  const {name, ver} = addSuffix(filename, version);
  const external = Object.keys(externals);
  const extensions = [".ts", ".tsx", ".mjs", ".js", ".jsx"];

  return defineConfig({
    input: "src/index.ts",
    output: {
      file: `dist/${name}.user.js`,
      format: "iife",
      banner: `(async () => {`,
      footer: `})();`,
      indent: false,
      sourcemap: false,
      globals: externals,
    },
    external,
    plugins: [
      babel({
        babelrc: false,
        babelHelpers: "runtime",
        presets: [
          [
            "@babel/preset-env",
            {modules: false, targets: "> 0.5%, Firefox ESR, not dead"},
          ],
          "@babel/preset-typescript",
        ],
        plugins: [
          [
            "@babel/plugin-transform-runtime",
            {useESModules: true, version: "^7.5.0"},
          ],
          ["@babel/plugin-proposal-decorators", {version: "2023-05"}],
        ],
        exclude: "node_modules/**",
        extensions,
      }),
      nodeResolve({browser: false, extensions}),
      userscript((meta) => {
        return meta
          .replace("{{version}}", ver ?? "-")
          .replace("{{description}}", description ?? "-")
          .replace("{{license}}", license ?? "-")
          .replace("{{author}}", author ?? "-")
          .replace("{{tracker}}", tracker ?? "-")
          .replace("{{homepage}}", homepage ?? "-");
      }),
    ],
  });
}
