
import packageMetadata from './package';

export interface RequireExternals {
  [key: string]: string[] | string;
}
/**
 * Transform dependensies key-value to jsdelivr urls array
 * @param {RequireExternals} externals dependencies with jsdelivr path.
 * @return {string[]} the metadata block as a string.
 */
export function requireURLs(externals: RequireExternals): string[] {
  return Object.entries(externals)
      .reduce((res: string[], [name, path]) => {
        const fn = (name: string, path: string) => {
          const version = packageMetadata.dependencies?.[name];
          if (version) {
            res.push(`https://cdn.jsdelivr.net/npm/${name}@${version}${path}`);
          }
        };
        if (Array.isArray(path)) {
          path.forEach(fn.bind(undefined, name));
        } else {
          fn(name, path);
        }
        return res;
      }, []);
}
