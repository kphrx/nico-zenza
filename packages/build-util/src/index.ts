/* eslint-env node */
import {env} from "node:process";

import {defineConfig} from "rollup";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import importCss from "rollup-plugin-import-css";
import userscript from "rollup-plugin-userscript";

import {getPackageMetadata} from "./utils/packageMetadata.js";
import {getScriptMetadata} from "./utils/scriptMetadata.js";

function addSuffix(filename: string, version: string) {
  const now = new Date().getTime().toString();

  if (env.NODE_ENV === "production") {
    return {filename, version};
  }

  const separator = version.includes("-") ? `.` : `-`;
  return {
    filename: `${filename}+dev`,
    version: `${version}${separator}dev.${now}`,
  };
}

interface Dependency {
  moduleName: string;
  packageName?: string;
  variableName?: string;
}

function getPackageName(dep: Dependency) {
  return (
    dep.packageName ?? dep.moduleName.match(/^(@[^/@]+\/)?[^/@]+/)?.[0] ?? ""
  );
}

function getVariableName(dep: Dependency) {
  return (
    dep.variableName ??
    dep.moduleName
      .replaceAll(/^@[^/@]+\//g, "")
      .replaceAll(/-(\w)/g, (_, c: string) => c.toUpperCase())
      .replaceAll(/[^\w]/g, "_")
  );
}

function getExportPath(dep: Dependency) {
  return dep.moduleName.slice(getPackageName(dep).length).trim();
}

function getRequireSet(
  cjsModules: Dependency[],
  deps: {[key: string]: string} = {},
) {
  const requireSet = new Set<string>();
  for (const cjsDep of cjsModules) {
    const pkgName = getPackageName(cjsDep);
    requireSet.add(
      `https://cdn.jsdelivr.net/npm/${pkgName}@${deps[pkgName]}${getExportPath(cjsDep)}`,
    );
  }

  return requireSet;
}

function getEsmImporter(
  esModules: Dependency[],
  deps: {[key: string]: string} = {},
) {
  let banner = "(async () => {";

  if (esModules.length > 0) {
    banner += `
const [${esModules.map(getVariableName).join(", ")}] = await Promise.all([
  ${esModules
    .map((m) => {
      const pkgName = getPackageName(m);
      return `import("https://esm.run/${pkgName}@${deps[pkgName]}${getExportPath(m)}")`;
    })
    .join(",\n  ")}
]);`;
  }

  return {
    banner,
    footer: "})();",
  };
}

type RequiredKey<T, K extends keyof T> = T & Required<Pick<T, K>>;

export function rollupConfig({
  useDecorator = false,
  externals,
}: Partial<{
  useDecorator: boolean;
  externals: Partial<{
    cjsModules: RequiredKey<Dependency, "variableName">[];
    esModules: Dependency[];
  }>;
}> = {}) {
  const {
    filename: baseFilename,
    version: baseVersion,
    description,
    license,
    author,
    tracker,
    homepage,
    dependencies,
  } = getPackageMetadata();
  const extensions = [".ts", ".tsx", ".mjs", ".js", ".jsx"];
  const {filename, version} = addSuffix(baseFilename, baseVersion);

  const cjsModules = externals?.cjsModules ?? [];
  const esModules = externals?.esModules ?? [];
  const deps = [...cjsModules, ...esModules];

  const requireSet = getRequireSet(cjsModules, dependencies);
  const {banner, footer} = getEsmImporter(esModules, dependencies);

  const globals = Object.fromEntries(
    deps.map((dep) => [dep.moduleName, getVariableName(dep)]),
  );

  let metadata = "";

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
    external: /node_modules/,
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
          useDecorator && ["@babel/proposal-decorators", {version: "2023-11"}],
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
        metadata = getScriptMetadata(
          meta,
          Object.assign(
            {},
            {
              version,
              description,
              license,
              author: author.toString(),
              supportURL: tracker,
              homepageURL: homepage,
            },
            env.DOWNLOAD_BASE_URL
              ? {
                  downloadURL: `${env.DOWNLOAD_BASE_URL}/${filename}.user.js`,
                  updateURL: `${env.DOWNLOAD_BASE_URL}/${filename}.meta.js`,
                }
              : {},
          ),
          requireSet,
        );
        return metadata;
      }),
      {
        name: "generate meta.js",
        generateBundle() {
          this.emitFile({
            type: "prebuilt-chunk",
            fileName: `${filename}.meta.js`,
            code: `${metadata}\n`,
          });
        },
      },
    ],
  });
}
