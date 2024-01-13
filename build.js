/* eslint-env node */
import {execFile, spawn} from "node:child_process";
import {promisify} from "node:util";
import {join} from "node:path";
import {readdir, rename, rm, mkdir, writeFile} from "node:fs/promises";
import {createInterface} from "node:readline/promises";
import {env, stdout, stderr} from "node:process";

const userScriptReg =
  env.NODE_ENV != "production"
    ? /^.*\+dev\.user\.js$/
    : /^(?!.*\+dev\.user.js$).*\.user.js$/;

const {stdout: queryStdout} = await promisify(execFile)("npm", [
  "--loglevel",
  env.npm_config_loglevel,
  "query",
  '.workspace[name^="@nico-zenza-script/"]',
]);
const pkgs = JSON.parse(queryStdout);

const builds = pkgs.map(async ({name, version, location}) => {
  const build = spawn("npm", ["run", "build", "-w", name]);

  build.stdout.on("data", (x) => stdout.write(x.toString().trimStart()));

  const wait = new Promise((resolve) => {
    build.on("close", () => resolve());
  });

  const readline = createInterface({input: build.stderr});
  for await (const line of readline) {
    stderr.write(name);
    stderr.write(`: ${line}\n`);
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
  for (const filename of await readdir(dest)) {
    if (userScriptReg.test(filename)) {
      return {
        name,
        version,
        filename,
        path: join(dest, filename),
      };
    }
  }
});

const dest = join(import.meta.dirname, "dist");
await rm(dest, {recursive: true}).catch(() => {});
await mkdir(dest);

const scripts = await Promise.all(
  builds.map(async (build) => {
    const {path, filename, ...result} = await build;

    await rename(path, join(dest, filename));

    return {
      ...result,
      filename,
    };
  }),
);

writeFile(join(dest, "scripts.json"), JSON.stringify(scripts, null, "\t"));
