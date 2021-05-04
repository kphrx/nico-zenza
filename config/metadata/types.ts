
import {URL} from 'url';
import {EntryObject} from 'webpack';

type ValueOf<T> = T[keyof T];

type AuthorName = {
  name: string;
  email?: string;
  url?: string;
};
type Copyright = {
  year: string | number;
} & AuthorName;

type ObjectOrString<T> = T | string;

type LocalizableField = ObjectOrString<{[key: string]: string}>;
type URLField = ObjectOrString<URL>;
type PeopleField = ObjectOrString<AuthorName>;
type CopyrightField = ObjectOrString<Copyright>;

type OneOrMany<T> = T[] | T;

interface GreasemonkeyMetadata {
  name: LocalizableField;
  namespace: OneOrMany<string>;
  description: LocalizableField;
  icon: URLField;
  author: PeopleField;
  homepageURL: OneOrMany<URLField>;
  runAt: string;
  include: OneOrMany<string>;
  exclude: OneOrMany<string>;
  match: OneOrMany<string>;
  noframes: null;
  require: OneOrMany<string>;
  resource: OneOrMany<string>;
  grant: OneOrMany<string>;
  unwrap: null;
  version: string | number;
  updateURL: URLField;
  installURL: URLField;
  downloadURL: URLField;
}
interface OpenUserJSOrgMetadata {
  copyright: CopyrightField;
  license: OneOrMany<string>;
  homepageURL: OneOrMany<URLField>;
  supportURL: OneOrMany<URLField>;
  author: PeopleField;
  collaborator: OneOrMany<PeopleField>;
  unstableMinify: string;
}
interface UserscriptsOrgMetadata {
  copyright: CopyrightField;
  license: OneOrMany<string>;
  usoScript: string | number;
  usoVersion: string | number;
  usoTimestamp: string;
  usoHash: string;
  usoRating: string | number;
  usoInstalls: string | number;
  usoReviews: string | number;
  usoDiscussions: string | number;
  usoFans: string | number;
}
interface UserContributedMetadata {
  usoUnlisted: string;
  attribution: OneOrMany<PeopleField>;
  contributor: OneOrMany<PeopleField>;
  author: PeopleField;
  major: string | number;
  minor: string | number;
  build: string | number;
}

type UserScriptMetadata = Partial<GreasemonkeyMetadata
  & OpenUserJSOrgMetadata
  & UserscriptsOrgMetadata
  & UserContributedMetadata>;

interface Entrypoint {
  entry: EntryObject['Description'];
  metadata: UserScriptMetadata;
}

export {
  OneOrMany,
  ValueOf,

  AuthorName,
  Copyright,

  UserScriptMetadata,
  Entrypoint,
};
