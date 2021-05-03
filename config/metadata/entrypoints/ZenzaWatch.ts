
import {Entrypoint} from '../types';

const metadata: Entrypoint = {
  entry: {
    import: './src/watch.ts',
    filename: 'ZenzaWatch.user.js',
  },
  metadata: {
    description: 'ニコニコ動画の速くて軽い動画プレイヤー',
    match: [
      '*://*.nicovideo.jp/*', // instead
      // '*://www.nicovideo.jp/*',
      // '*://ext.nicovideo.jp/',
      // '*://ext.nicovideo.jp/#*',
      // '*://blog.nicovideo.jp/*',
      // '*://ch.nicovideo.jp/*',
      // '*://com.nicovideo.jp/*',
      // '*://commons.nicovideo.jp/*',
      // '*://dic.nicovideo.jp/*',
      // '*://ex.nicovideo.jp/*',
      // '*://info.nicovideo.jp/*',
      // '*://search.nicovideo.jp/*',
      // '*://uad.nicovideo.jp/*',
      // '*://api.search.nicovideo.jp/*',
      // '*://*.nicovideo.jp/smile*',
      // '*://site.nicovideo.jp/*',
      // '*://anime.nicovideo.jp/*',
      'https://www.upload.nicovideo.jp/garage/*',
      'https://www.google.co.jp/search*',
      'https://www.google.com/search*',
      'https://*.bing.com/search*',
      'https://feedly.com/*',
    ],
    exclude: [
      '*://ads.nicovideo.jp/*',
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
