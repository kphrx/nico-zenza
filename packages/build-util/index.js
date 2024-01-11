/* eslint-env node */
import typescript from "@rollup/plugin-typescript";
import metablock from "rollup-plugin-userscript-metablock";

function addSuffix(name, version) {
  if (process.env.NODE_ENV !== "production") {
    (name += "+dev"), (version += version.indexOf("-") !== -1 ? "." : "-");
    version += `dev.${new Date().getTime()}`;
  }

  return {name, version};
}

export function rollupConfig(
  {filename, version, description, license, author, source, homepage} = {},
  metadataFile,
) {
  const {name, ...override} = {
    ...addSuffix(filename, version),
    description,
    license,
    author,
    source,
    homepage,
  };

  return {
    input: "src/main.ts",
    output: {
      file: `dist/${name}.user.js`,
      format: "esm",
      sourcemap: process.env.NODE_ENV !== "production" && "inline",
    },
    plugins: [
      typescript(),
      metablock({
        file: metadataFile,
        override,
      }),
    ],
  };
}
