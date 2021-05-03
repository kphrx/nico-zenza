
import {
  ModuleFilenameHelpers,
  Compilation,
  Compiler,
  sources,
} from 'webpack';

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

/**
 * Prepend UserScript Metadata to `*.user.js` files
 */
class UserScriptMetadataPlugin {
  headers: {[key: string]: string}

  /**
   * Initialize UserScript metadata plugin
   * @param {Object.<string, UserScriptMetadata>} options metadata objects
   */
  constructor(options: {[key: string]:UserScriptMetadata}) {
    const entryPoints = Object.keys(options);
    this.headers = {};
    for (const name of entryPoints) {
      const metadata = {name, ...options[name]};
      this.headers[name] = this._buildHeader(metadata);
    }
  }

  /**
   * Build UserScript header from UserScriptMetadata object.
   * @param {UserScriptMetadata} metadata metadata struct.
   * @return {String} userscript metadata key-value.
   */
  _buildHeader(metadata: UserScriptMetadata): string {
    const result = ['// ==UserScript=='];
    type Key = keyof typeof metadata;
    const entryPoints = Object.keys(metadata);
    const long = entryPoints.reduce(
        (res, name) => name.length > res ? name.length : res,
        0);
    for (const name of entryPoints) {
      result.push(`// @${name.padEnd(long+1, ' ')}${metadata[name as Key]}`);
    }
    result.push('// ==/UserScript==');
    return result.join('\n');
  }

  /**
   * Compile via webpack
   * @param {Compiler} compiler options
   */
  apply(compiler: Compiler) {
    const matchObject = ModuleFilenameHelpers.matchObject.bind(
        undefined,
        {test: /\.user\.js$/},
    );
    compiler.hooks.compilation.tap(this.constructor.name,
        (compilation: Compilation) => {
          compilation.hooks.processAssets.tap(
              {
                name: this.constructor.name,
                stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
              },
              () => {
                for (const chunk of compilation.chunks) {
                  if (!chunk.canBeInitial()) {
                    continue;
                  }
                  const header = this.headers[chunk.name];
                  if (!header) {
                    continue;
                  }
                  for (const file of chunk.files) {
                    if (!matchObject(file)) {
                      continue;
                    }
                    compilation.updateAsset(
                        file,
                        (old) => new sources.ConcatSource(
                            String(header),
                            '\n',
                            old),
                    );
                  }
                }
              });
        });
  }
}

export default UserScriptMetadataPlugin;
