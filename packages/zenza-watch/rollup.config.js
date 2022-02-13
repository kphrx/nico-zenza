/* eslint-env node */
import typescript from "@rollup/plugin-typescript";
import metablock from "rollup-plugin-userscript-metablock";
import pkg from "./package.json";

const production = process.env.NODE_ENV === "production";

let filename = process.env.npm_package_name.split("/").pop();
let version = process.env.npm_package_version;

if (!production) {
  filename += "+dev";
  version += `-dev.${new Date().getTime()}`;
}

export default {
  input: "src/main.ts",
  output: {
    file: `dist/${filename}.user.js`,
    format: "esm",
    sourcemap: !production && "inline",
  },
  plugins: [
    typescript(),
    metablock({
      file: "./metadata.yml",
      override: {
        version,
        description: pkg.description,
        license: pkg.license,
        author: pkg.author,
        source: pkg.repository.url,
        homepage: pkg.homepage,
      },
    }),
  ],
};
