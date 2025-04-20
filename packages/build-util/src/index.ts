/* eslint-env node */
import {env} from "node:process";

import {defineConfig} from "rollup";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import strip from "@rollup/plugin-strip";
import importCss from "rollup-plugin-import-css";
import userscript from "rollup-plugin-userscript";

import {getPackageMetadata} from "./utils/packageMetadata.js";
import {getScriptMetadata} from "./utils/scriptMetadata.js";

const isDev = env.NODE_ENV !== "production";

function addSuffix(filename: string, version: string) {
  const now = new Date().getTime().toString();

  if (!isDev) {
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
    dep.packageName ?? /^(@[^/@]+\/)?[^/@]+/.exec(dep.moduleName)?.[0] ?? ""
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
  deps: Record<string, string> = {},
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

declare global {
  interface ObjectConstructor {
    hasOwn<T extends object>(o: T, v: PropertyKey): v is keyof T;
  }
}

const bypassDynamicImport = <
  T extends {default?: unknown; [key: PropertyKey]: unknown},
>({
  default: defaultExport,
  ...exports
}: T): (T["default"] & T) | Omit<T, "default"> => {
  const proxyHandler: ProxyHandler<object | ((...args: never) => unknown)> = {
    get(target, prop) {
      if (prop in exports) {
        return exports[prop];
      }
      if (Object.hasOwn(target, prop)) {
        return target[prop];
      }
    },
    getOwnPropertyDescriptor(target, prop) {
      return Reflect.getOwnPropertyDescriptor(
        prop in exports ? exports : target,
        prop,
      );
    },
    ownKeys(target) {
      return Array.from(
        new Set([...Reflect.ownKeys(target), ...Reflect.ownKeys(exports)]),
      );
    },
  };

  switch (typeof defaultExport) {
    case "bigint":
    case "symbol":
    case "string":
    case "number":
    case "boolean":
      throw new TypeError(
        `\`target\` argument of Proxy must be an object, got ${typeof defaultExport} ${defaultExport.toString()}`,
      );
    case "undefined":
    case "function":
    case "object":
      if (defaultExport == null) {
        return exports;
      }
      return new Proxy(defaultExport, proxyHandler) as T["default"] & T;
  }
};

function getEsmImporter(
  esModules: Dependency[],
  deps: Record<string, string> = {},
) {
  let banner = "(async () => {";

  if (esModules.length > 0) {
    banner += `
const moduleProxy = ${bypassDynamicImport.toString()};

const [${esModules.map(getVariableName).join(", ")}] = await Promise.all([
  ${esModules
    .map((m) => {
      const pkgName = getPackageName(m);
      return `import("https://esm.run/${pkgName}@${deps[pkgName]}${getExportPath(m)}").then(moduleProxy),`;
    })
    .join("\n  ")}
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
      strip({
        include: "**/*.ts",
        functions: isDev
          ? []
          : ["console.debug", "console.time", "console.timeEnd"],
      }),
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
