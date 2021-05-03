
import {Entrypoint} from '../types';

const metadata: Entrypoint = {
  entry: {
    import: './src/uquery.ts',
    filename: 'uQuery.user.js',
  },
  metadata: {
    contributor: 'guest',
    version: '0.0.1',
    description: 'コンソールのデバッグ補助ツール(開発者用)',
    match: '*://*/*',
    runAt: 'document-start',
    noframes: null,
  },
};


export default metadata;
