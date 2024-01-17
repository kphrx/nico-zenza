/* eslint-env node */
import {env} from "node:process";
import {defineConfig} from "rollup";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import importCss from "rollup-plugin-import-css";
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
  useDecorator: boolean;
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
  useDecorator = false,
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
          "@babel/typescript",
        ],
        plugins: [
          useDecorator && ["@babel/proposal-decorators", {version: "2023-05"}],
        ].filter((x) => x),
        exclude: "node_modules/**",
        extensions,
      }),
      nodeResolve({browser: false, extensions}),
      importCss({modules: true}),
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
