import {join} from "node:path";
import {cwd} from "node:process";
import {readFile} from "node:fs/promises";
import {exec} from "node:child_process";
import {promisify} from "node:util";

type IAuthor =
  | {
      name: string;
      url?: string;
      email?: string;
    }
  | string;

class Author {
  name: string | undefined;
  url?: string;
  email?: string;

  constructor(model: IAuthor | undefined) {
    if (model == null) {
      return;
    }

    if (typeof model === "string") {
      this.name = model;
      return;
    }

    this.name = model.name;
    this.url = model.url;
    this.email = model.email;
  }

  toString(): string | undefined {
    let name = this.name;

    if (name == null) {
      return;
    }

    if (this.email != null) {
      name += ` <${this.email}>`;
    }
    if (this.url != null) {
      name += ` (${this.url})`;
    }

    return name;
  }
}

interface PackageJSON {
  description: string;
  license: string;
  author: IAuthor;
  bugs:
    | Partial<{
        url: string;
        email: string;
      }>
    | string;
  homepage?: string;
}

const [
  [packageName, {version, dependencies: packageDependencies = {}}],
  {description, license, author: authorModel, bugs, homepage},
] = await Promise.all([
  promisify(exec)(`npm ls --json`)
    .then(
      ({stdout}) =>
        JSON.parse(stdout) as {
          dependencies: Record<
            string,
            {
              version: string;
              dependencies?: Record<string, {version: string}>;
            }
          >;
        },
    )
    .then(({dependencies}) => Object.entries(dependencies)[0]),
  readFile(join(cwd(), "package.json"), "utf8").then(
    (json) => JSON.parse(json) as Partial<PackageJSON>,
  ),
]);

const filename = packageName.split("/").toReversed()[0];
const author = new Author(authorModel);
const tracker = typeof bugs === "string" ? bugs : bugs?.url;
const dependencies = Object.fromEntries(
  Object.entries(packageDependencies).map(([name, {version}]) => [
    name,
    version,
  ]),
);

export const packageMetadata = {
  filename,
  version,
  description,
  license,
  author,
  tracker,
  homepage,
  dependencies,
};
