
import {URL} from 'url';
import {
  ModuleFilenameHelpers,
  Compilation,
  Compiler,
  WebpackPluginInstance,
  sources,
} from 'webpack';
import {UserScriptMetadata, ValueOf} from './types';

/**
 * Prepend UserScript Metadata to `*.user.js` files
 */
class UserScriptMetadataPlugin implements WebpackPluginInstance {
  metadataList: {[key: string]: UserScriptMetadata}

  /**
   * Initialize UserScript metadata plugin
   * @param {Object.<string, UserScriptMetadata>} options metadata objects
   */
  constructor(options: {[key: string]:UserScriptMetadata}) {
    const entryPoints = Object.keys(options);
    this.metadataList = {};
    for (const name of entryPoints) {
      const metadata = {name, ...options[name]};
      this.metadataList[name] = metadata;
    }
  }

  /**
   * Transform to string from ValueOf<Metadata>
   * @param {ValueOf<UserScriptMetadata>} value metadata value.
   * @return {String | undefined} kebabCase/colon separated string.
   */
  _metadataToString(value: ValueOf<UserScriptMetadata>): string[] | undefined {
    if (value == null) {
      return undefined;
    }
    if (!Array.isArray(value)) {
      if (typeof value === 'number') {
        return [String(value)];
      }
      if (typeof value === 'string') {
        return [value];
      }
      if (value instanceof URL) {
        return [value.toString()];
      }
      if ('year' in value) {
        let copyright = `(c) ${value.year} ${value.name}`;
        copyright = value.email ? `${copyright} <${value.email}>` : copyright;
        copyright = value.url ? `${copyright} (${value.url})` : copyright;
        return [copyright];
      }
      if ('name' in value) {
        let name = value.name;
        name = value.email ? `${name} <${value.email}>` : name;
        name = value.url ? `${name} (${value.url})` : name;
        return [name];
      }
      return Object.entries(value).map(([key, value]) => {
        return `${key} ${value}`;
      });
    }
    let result: string[] | undefined = undefined;
    for (const v of value) {
      const vs = this._metadataToString(v);
      if (vs == null) {
        continue;
      }
      result = [
        ...result || [],
        ...vs,
      ];
    }
    return result;
  }

  /**
   * Build UserScript header from UserScriptMetadata object.
   * @param {[string, string?][]} metadata metadata entries.
   * @param {number} length metadata key length.
   * @return {String} userscript metadata headers.
   */
  _buildHeader(metadata: [string, string?][], length: number): string {
    const result = ['// ==UserScript=='];
    for (const [key, value] of metadata) {
      if (value == null) {
        result.push(`// @${key}`);
        continue;
      }
      result.push(`// @${key.padEnd(length+3, ' ')}${value}`);
    }
    result.push('// ==/UserScript==');
    return result.join('\n');
  }

  /**
   * UserScript headers.
   * @return {Object.<string, string>} userscript metadata headers.
   */
  get headers(): {[key: string]: string} {
    const res: {[key: string]: string} = {};
    for (const [name, metadata] of Object.entries(this.metadataList)) {
      let metadataEntries = Object.entries(metadata);
      metadataEntries = metadataEntries.map(([key, value]) => {
        switch (key) {
          case 'runAt':
            key = 'run-at';
            break;
          case 'usoScript':
            key = 'uso:script';
            break;
          case 'usoVersion':
            key = 'uso:version';
            break;
          case 'usoTimestamp':
            key = 'uso:timestamp';
            break;
          case 'usoHash':
            key = 'usoHash';
            break;
          case 'usoRating':
            key = 'uso:rating';
            break;
          case 'usoInstalls':
            key = 'uso:installs';
            break;
          case 'usoReviews':
            key = 'uso:reviews';
            break;
          case 'usoDiscussions':
            key = 'uso:discussions';
            break;
          case 'usoFans':
            key = 'uso:fans';
            break;
          case 'usoUnlisted':
            key = 'uso:unlisted';
            break;
          default:
            break;
        }
        return [key, value];
      });

      const keyValues: [string, string?][] = [];
      for (const [key, value] of metadataEntries) {
        const values = this._metadataToString(value);
        if (values == null &&
            ['noframes', 'unwrap', 'usoUnlisted'].includes(key)) {
          keyValues.push([key, undefined]);
          continue;
        }
        if (values == null) {
          continue;
        }
        for (const v of values) {
          if (key === 'name') {
            const separate = v.indexOf(' ');
            keyValues.push([
              `${key}:${v.slice(0, separate)}`,
              v.slice(separate+1),
            ]);
          } else {
            keyValues.push([key, v]);
          }
        }
      }
      const keyLength = keyValues.reduce((res, [key]) => {
        return key.length > res ? key.length : res;
      }, 0);
      res[name] = this._buildHeader(keyValues, keyLength);
    }
    return res;
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
