
import {Entrypoint} from '../types';

const metadata: Entrypoint = {
  entry: {
    import: './src/pocket.ts',
    filename: 'MylistPocket.user.js',
  },
  metadata: {
    contributor: 'segabito macmoto',
    version: '0.5.14',
    description: '動画をあとで見る ＋ 簡易NG機能。 ZenzaWatchとの連携も可能。',
    match: [
      '*://*.nicovideo.jp/*', // instead
      // '*://www.nicovideo.jp/*',
      // '*://ext.nicovideo.jp/',
      // '*://ext.nicovideo.jp/#*',
      // '*://ch.nicovideo.jp/*',
      // '*://com.nicovideo.jp/*',
      // '*://commons.nicovideo.jp/*',
      // '*://dic.nicovideo.jp/*',
      // '*://ex.nicovideo.jp/*',
      // '*://info.nicovideo.jp/*',
      // '*://search.nicovideo.jp/*',
      // '*://uad.nicovideo.jp/*',
      // '*://site.nicovideo.jp/*',
      // '*://anime.nicovideo.jp/*',
      'https://www.google.com/search?*',
      'https://www.google.co.jp/search?*',
      'https://*.bing.com/*',
    ],
    exclude: [
      '*://ads*.nicovideo.jp/*',
      '*://www.upload.nicovideo.jp/*',
      '*://www.nicovideo.jp/watch/*?edit=*',
      '*://ch.nicovideo.jp/tool/*',
      '*://flapi.nicovideo.jp/*',
      '*://dic.nicovideo.jp/p/*',
      '*://ext.nicovideo.jp/thumb/*',
      '*://ext.nicovideo.jp/thumb_channel/*',
    ],
  },
};


export default metadata;
