/* eslint-env node */
import {env} from "node:process";
import {definePlugins} from "@gera2ld/plaid-rollup";
import {defineConfig} from "rollup";
import userscript from "rollup-plugin-userscript";

function addSuffix(filename, version) {
  if (env.NODE_ENV !== "production") {
    const now = new Date().getTime();

    return {
      name: `${filename}+dev`,
      ver:
        version.indexOf("-") !== -1
          ? `${version}.dev.${now}`
          : `${version}-dev.${now}`,
    };
  }

  return {
    name: filename,
    ver: version,
  };
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
} = {}) {
  const {name, ver} = addSuffix(filename, version);
  const external = Object.keys(externals);

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
      ...definePlugins({
        babelConfig: {
          presets: [
            [
              "@babel/preset-env",
              {
                modules: false,
                targets: "> 0.5%, Firefox ESR, not dead",
              },
            ],
            "@babel/preset-typescript",
          ],
        },
        esm: true,
        aliases: false,
        extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx"],
        postcss: false,
        minimize: false,
      }),
      userscript((meta) => {
        return meta
          .replace("{{version}}", ver)
          .replace("{{description}}", description)
          .replace("{{license}}", license)
          .replace("{{author}}", author)
          .replace("{{tracker}}", tracker)
          .replace("{{homepage}}", homepage);
      }),
    ],
  });
}
