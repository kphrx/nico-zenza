/* eslint-env node */
import {execFile, spawn} from "node:child_process";
import {promisify} from "node:util";
import {join} from "node:path";
import {readdir, rename, rm, mkdir, writeFile} from "node:fs/promises";
import {createInterface} from "node:readline/promises";
import {createColors} from "colorette";
import {env, stdout, stderr} from "node:process";

const {bold, dim} = createColors({
  useColor: env.FORCE_COLOR !== "0" && !env.NO_COLOR,
});

const userScriptReg =
  env.NODE_ENV != "production"
    ? /^.*\+dev\.(user|meta)\.js$/
    : /^(?!.*\+dev\.(user|meta).js$).*\.(user|meta).js$/;

const {stdout: queryStdout} = await promisify(execFile)("npm", [
  "--loglevel",
  env.npm_config_loglevel,
  "query",
  ".workspace:attr([keywords=script])",
]);
const pkgs = JSON.parse(queryStdout);
const padding = Math.max(...pkgs.map((x) => x.name.length));

const builds = await Promise.all(
  pkgs.map(async ({name, version, location}) => {
    const build = spawn("npm", ["run", "build:script", "-w", name]);

    build.stdout.on("data", (x) => stdout.write(x.toString().trimStart()));

    const wait = new Promise((resolve) => {
      build.on("close", () => resolve());
    });

    const [scope, pkgName] = name.padEnd(padding).split("/");
    const prefixName = dim(`${scope}/`) + pkgName;

    const readline = createInterface({input: build.stderr});
    for await (const line of readline) {
      stderr.write(bold(prefixName));
      stderr.write(`\t${line}\n`);
    }

    await wait;

    if (build.exitCode !== 0) {
      throw {
        name,
        version,
        code: build.exitCode,
      };
    }

    const dest = join(import.meta.dirname, location, "dist");
    return (await readdir(dest))
      .filter((filename) => userScriptReg.test(filename))
      .map((filename) => {
        return {
          name,
          version,
          filename,
          path: join(dest, filename),
        };
      });
  }),
);

const dest = join(import.meta.dirname, "dist");
await rm(dest, {recursive: true}).catch((err) =>
  console.warn(err.message ?? err),
);
await mkdir(dest);

const scripts = await Promise.all(
  builds.flat().map(async ({path, filename, ...result}) => {
    await rename(path, join(dest, filename));

    return {
      ...result,
      filename,
    };
  }),
);

writeFile(join(dest, "scripts.json"), JSON.stringify(scripts, null, "\t"));
