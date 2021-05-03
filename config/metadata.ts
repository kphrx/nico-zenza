
import WebpackPlugin, {
  UserScriptMetadata,
  PeopleField,
} from './metadata-webpack-plugin';
import packageMetadata from '../package.json';

interface Package {
  version: string;
  description: string;
  homepage: string;
  // old {type:string;url:string}, licenses: {type:string;url:string}[];
  license: string;
  author: PeopleField;
  contributors: PeopleField[];
  repository: {
    type: string;
    url: string;
    directory?: string
  } | string;
  dependencies: {[key: string]: string};
}
const {
  version = '',
  description = '',
  homepage = '',
  license = '',
  author = '',
  // repository = '',
  dependencies = {},
} = packageMetadata as Partial<Package>;

export interface RequireExternals {
  [key: string]: string[] | string
}
/**
 * Transform dependensies key-value to jsdelivr urls array
 * @param {RequireExternals} externals dependencies with jsdelivr path.
 * @return {string[]} the metadata block as a string.
 */
export function requireURLs(externals: RequireExternals): string[] {
  return Object.keys(externals)
      .reduce((res: string[], name: string[] | string) => {
        const fn = (name: string) => {
          const version = dependencies[name as keyof typeof dependencies];
          res.push(`https://cdn.jsdelivr.net/npm/${name}@${version}${externals[name]}`);
        };
        if (Array.isArray(name)) {
          name.forEach(fn);
        } else {
          fn(name);
        }
        return res;
      }, []);
}

const baseMetadata: UserScriptMetadata = {
  'namespace': 'https://kpherox.dev/',
  version,
  author,
  description,
  license,
  // 'source': repository.url,
  'homepageURL': homepage,
  'grant': 'none',
  'run-at': 'document-body',
};

/**
 * UserScriptMetadataPlugin addition base metadata
 * @param {Object.<string, UserScriptMetadata>} options metadata.
 * @return {WebpackPlugin} UserScriptMetadataPlugin instance.
 */
export default function(options: {
  [key: string]: UserScriptMetadata
}): WebpackPlugin {
  const entryPoints = Object.keys(options);
  return new WebpackPlugin(entryPoints.reduce((
      res: {[key: string]: UserScriptMetadata},
      name: string,
  ): {[key: string]: UserScriptMetadata} => {
    res[name] = {
      name,
      ...baseMetadata,
      ...options[name],
    };
    return res;
  }, {}),
  );
}
