
import {Entrypoint} from '../types';

const metadata: Entrypoint = {
  entry: {
    import: './src/my4.ts',
    filename: 'MylistFilter.user.js',
  },
  metadata: {
    contributor: '名無しさん@匿名希望',
    version: '0.0.1',
    name: 'Mylist Filter',
    description: '視聴不可能な動画だけ表示して一括削除とかできるやつ',
    match: '*://www.nicovideo.jp/my/mylist*',
    runAt: 'document-body',
    noframes: null,
  },
};


export default metadata;
