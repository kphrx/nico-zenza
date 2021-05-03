
import {Entrypoint} from '../types';

const metadata: Entrypoint = {
  entry: {
    import: './src/heatsync.ts',
    filename: 'HeatSync.user.js',
  },
  metadata: {
    contributor: 'segabito macmoto',
    version: '0.0.18',
    description: 'コメントの少ないところだけ自動で早送りする、忙しい人のためのZenzaWatch拡張',
    match: [
      '*://www.nicovideo.jp/*',
      '*://ext.nicovideo.jp/',
      '*://ext.nicovideo.jp/#*',
      '*://ch.nicovideo.jp/*',
      '*://com.nicovideo.jp/*',
      '*://commons.nicovideo.jp/*',
      '*://dic.nicovideo.jp/*',
    ],
    exclude: [
      '*://ads*.nicovideo.jp/*',
      '*://www.upload.nicovideo.jp/*',
      '*://www.nicovideo.jp/watch/*?edit=*',
      '*://ch.nicovideo.jp/tool/*',
      '*://flapi.nicovideo.jp/*',
      '*://dic.nicovideo.jp/p/*',
    ],
    noframes: null,
  },
};


export default metadata;
