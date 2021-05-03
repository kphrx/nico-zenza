
import {Entrypoint} from '../types';

const metadata: Entrypoint = {
  entry: {
    import: './src/shape.ts',
    filename: 'MaskedWatch.user.js',
  },
  metadata: {
    contributor: '名無しさん',
    version: '0.3.2',
    name: 'Masked Watch',
    description: '動画上のテキストや顔を検出してコメントを透過する',
    match: [
      '*://www.nicovideo.jp/*',
      '*://live.nicovideo.jp/*',
      '*://anime.nicovideo.jp/*',
      '*://embed.nicovideo.jp/watch/*',
      '*://sp.nicovideo.jp/watch/*',
    ],
    exclude: [
      '*://ads*.nicovideo.jp/*',
      '*://www.nicovideo.jp/favicon.ico*',
      '*://www.nicovideo.jp/robots.txt*',
    ],
  },
};


export default metadata;
