
import BaseWebpackPlugin from './base-webpack-plugin';
import {UserScriptMetadata} from './types';
import {baseMetadata} from './package';

/**
 * Wrapper UserScriptMetadataPlugin addition base metadata
 */
class UserScriptMetadataPlugin extends BaseWebpackPlugin {
/**
 * UserScriptMetadataPlugin addition base metadata
 * @param {Object.<string, UserScriptMetadata>} options metadata.
 */
  constructor(options: {
  [key: string]: UserScriptMetadata
}) {
    const entryPoints = Object.keys(options);
    super(entryPoints.reduce((
        res: {[key: string]: UserScriptMetadata},
        name: string,
    ): {[key: string]: UserScriptMetadata} => {
      res[name] = {
        name,
        ...baseMetadata,
        ...options[name],
      };
      return res;
    }, {}));
  }
}

export default UserScriptMetadataPlugin;
