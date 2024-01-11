/* eslint-env node */
import {definePlugins} from "@gera2ld/plaid-rollup";
import userscript from "rollup-plugin-userscript";

function addSuffix(filename, version) {
  if (process.env.NODE_ENV !== "production") {
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
} = {}) {
  const {name, ver} = addSuffix(filename, version);

  return {
    input: "src/main.ts",
    output: {
      file: `dist/${name}.user.js`,
      format: "esm",
      banner: `(async () => {`,
      footer: `})();`,
      indent: false,
      sourcemap: false,
    },
    plugins: [
      ...definePlugins({
        babelConfig: {
          presets: [
            [
              "@babel/preset-env",
              {
                modules: false,
                loose: true,
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
  };
}
