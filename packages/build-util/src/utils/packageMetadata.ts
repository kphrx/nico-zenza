import {join} from "node:path";
import {cwd} from "node:process";
import {readFileSync} from "node:fs";

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
  name: string;
  version: string;
  description?: string;
  license?: string;
  author?: IAuthor;
  bugs?:
    | {
        url?: string;
        email?: string;
      }
    | string;
  homepage?: string;
  dependencies?: {[key: string]: string};
}

interface PackageMetadata {
  filename: string;
  version: string;
  description?: string;
  license?: string;
  author: Author;
  tracker?: string;
  homepage?: string;
  dependencies?: {[key: string]: string};
}

export function getPackageMetadata(): PackageMetadata {
  const {
    name,
    version,
    description,
    license,
    author: authorModel,
    bugs,
    homepage,
    dependencies,
  } = JSON.parse(
    readFileSync(join(cwd(), "package.json"), "utf8"),
  ) as PackageJSON;

  const filename = name.split("/").findLast(() => true)!;
  const author = new Author(authorModel);
  const tracker = typeof bugs === "string" ? bugs : bugs?.url;

  return {
    filename,
    version,
    description,
    license,
    author,
    tracker,
    homepage,
    dependencies,
  };
}
