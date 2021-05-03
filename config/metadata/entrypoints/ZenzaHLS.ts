
import {Entrypoint} from '../types';

const metadata: Entrypoint = {
  entry: {
    import: './src/hls.ts',
    filename: 'ZenzaHLS.user.js',
  },
  metadata: {
    contributor: 'segabito macmoto',
    version: '0.0.20',
    name: 'ZenzaWatch HLS Support',
    description: 'ZenzaWatchをHLSに対応させる',
    match: [
      '*://*.nicovideo.jp/*', // instead
      // '*://www.nicovideo.jp/*',
      // '*://blog.nicovideo.jp/*',
      // '*://ch.nicovideo.jp/*',
      // '*://com.nicovideo.jp/*',
      // '*://commons.nicovideo.jp/*',
      // '*://dic.nicovideo.jp/*',
      // '*://ex.nicovideo.jp/*',
      // '*://info.nicovideo.jp/*',
      // '*://uad.nicovideo.jp/*',
      // '*://api.search.nicovideo.jp/*',
      // '*://*.nicovideo.jp/smile*',
      // '*://site.nicovideo.jp/*',
      // '*://anime.nicovideo.jp/*',
    ],
    exclude: [
      '*://ads.nicovideo.jp/*',
      '*://www.upload.nicovideo.jp/*',
      '*://www.nicovideo.jp/watch/*?edit=*',
      '*://ch.nicovideo.jp/tool/*',
      '*://flapi.nicovideo.jp/*',
      '*://dic.nicovideo.jp/p/*',
    ],
    runAt: 'document-start',
    noframes: null,
  },
};


export default metadata;
