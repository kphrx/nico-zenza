import {resolve as resolveTs} from 'ts-node/esm';
import {loadConfig, createMatchPath} from 'tsconfig-paths';
import {pathToFileURL} from 'url';

const matchPath = (specifier) => {
  const configLoaderResult = loadConfig();
  if (configLoaderResult.resultType === 'failed') {
    console.warn(
        `${configLoaderResult.message}. tsconfig-paths will be skipped`,
    );
    return false;
  }
  const {absoluteBaseUrl, paths} = configLoaderResult;
  const matchPath = createMatchPath(absoluteBaseUrl, paths);
  return matchPath(specifier);
};

/**
 * ts-node/esm.resolve with tsconfig-paths
 * ref: https://github.com/TypeStrong/ts-node/discussions/1450#discussioncomment-1806115
 * @param {string} specifier
 * @param {{parentURL: string}} ctx
 * @param {resolve} defaultResolve
 * @return {Promise<{url: string}>}
 */
export function resolve(specifier, ctx, defaultResolve) {
  const match = matchPath(specifier);
  return match ?
    resolveTs(pathToFileURL(`${match}`).href, ctx, defaultResolve) :
    resolveTs(specifier, ctx, defaultResolve);
}

export {getFormat, transformSource, load} from 'ts-node/esm';
