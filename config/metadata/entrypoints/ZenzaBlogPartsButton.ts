
import {Entrypoint} from '../types';

const metadata: Entrypoint = {
  entry: {
    import: './src/blog.ts',
    filename: 'ZenzaBlogPartsButton.user.js',
  },
  metadata: {
    contributor: 'segabito macmoto',
    version: '0.0.3',
    description: 'ニコニコ動画のブログパーツにZenzaWatch起動用ボタンを追加',
    match: '*://ext.nicovideo.jp/thumb/*',
  },
};


export default metadata;
