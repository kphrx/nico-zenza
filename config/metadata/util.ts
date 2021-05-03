
import packageMetadata from './package';

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
          const version = packageMetadata.dependencies?.[name];
          if (version) {
            res.push(`https://cdn.jsdelivr.net/npm/${name}@${version}${externals[name]}`);
          }
        };
        if (Array.isArray(name)) {
          name.forEach(fn);
        } else {
          fn(name);
        }
        return res;
      }, []);
}
