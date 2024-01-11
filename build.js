import {execFile, spawn} from "node:child_process";
import {promisify} from "node:util";
import {readdir} from "node:fs/promises";
import {createInterface} from "node:readline/promises";

const userScriptReg =
  process.env.NODE_ENV != "production"
    ? /^.*\+dev\.user\.js$/
    : /^(?!.*\+dev\.user.js$).*\.user.js$/;

const {stdout} = await promisify(execFile)("npm", [
  "--loglevel",
  process.env.npm_config_loglevel,
  "query",
  '.workspace[name^="@nico-zenza-script/"]',
]);
const pkgs = JSON.parse(stdout);

const builds = pkgs.map(async (pkg) => {
  const build = spawn("npm", ["run", "build", "-w", pkg.name]);
  const result = {
    name: pkg.name,
    version: pkg.version,
  };

  build.stdout.on("data", (x) => console.log(`${x.toString().trim()}\n`));

  const wait = new Promise((resolve) => {
    build.on("close", () => resolve());
  });

  const readline = createInterface({input: build.stderr});
  for await (const line of readline) {
    process.stderr.write(`${pkg.name}: ${line}\n`);
  }

  await wait;

  if (build.exitCode !== 0) {
    throw {
      ...result,
      code: build.exitCode,
    };
  }

  for (const filename of await readdir(`${pkg.location}/dist`)) {
    if (userScriptReg.test(filename)) {
      return {
        ...result,
        filename,
        path: `${pkg.location}/dist/${filename}`,
      };
    }
  }
});

console.log(JSON.stringify(await Promise.all(builds)));
