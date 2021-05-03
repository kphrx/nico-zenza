
import {
  ModuleFilenameHelpers,
  Compilation,
  Compiler,
  WebpackPluginInstance,
  sources,
} from 'webpack';
import {UserScriptMetadata} from './types';

/**
 * Prepend UserScript Metadata to `*.user.js` files
 */
class UserScriptMetadataPlugin implements WebpackPluginInstance {
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
  apply(compiler: Compiler): void {
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
