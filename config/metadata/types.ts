
import {EntryObject} from 'webpack';

type OneOrMany<T> = T[] | T;
export type Copyright = {
  name: string;
  year: string | number;
  email?: string;
  url?: string;
} | string
export type PeopleField = {
  name: string;
  email?: string;
  url?: string;
} | string

interface GreasemonkeyMetadata {
  name: string | {[key: string]:string},
  namespace: OneOrMany<string>,
  description: string | {[key: string]:string},
  icon: string,
  author: PeopleField,
  homepageURL: OneOrMany<string>,
  'run-at': string,
  include: OneOrMany<string>,
  exclude: OneOrMany<string>,
  match: OneOrMany<string>,
  noframes: null | undefined,
  require: OneOrMany<string>,
  resource: OneOrMany<string>,
  grant: OneOrMany<string>,
  unwrap: null | undefined,
  version: string | number,
  updateURL: string,
  installURL: string,
  downloadURL: string,
}
interface OpenUserJSOrgMetadata {
  copyright: Copyright,
  license: OneOrMany<string>,
  homepageURL: OneOrMany<string>,
  supportURL: OneOrMany<string>,
  author: PeopleField,
  collaborator: PeopleField[] | string,
  unstableMinify: string,
}
interface UserscriptsOrgMetadata {
  copyright: Copyright,
  license: OneOrMany<string>,
  'uso:script': string | number,
  'uso:version': string | number,
  'uso:timestamp': string,
  'uso:hash': string,
  'uso:rating': string | number,
  'uso:installs': string | number,
  'uso:reviews': string | number,
  'uso:discussions': string | number,
  'uso:fans': string | number,
}
interface UserContributedMetadata {
  'uso:unlisted': string,
  attribution: OneOrMany<PeopleField>,
  contributor: OneOrMany<PeopleField>,
  author: PeopleField,
  major: string | number,
  minor: string | number,
  build: string | number,
}

export type UserScriptMetadata = Partial<GreasemonkeyMetadata
  | OpenUserJSOrgMetadata
  | UserscriptsOrgMetadata
  | UserContributedMetadata>

export interface Entrypoint {
  entry: EntryObject['Description']
  metadata: UserScriptMetadata
}
