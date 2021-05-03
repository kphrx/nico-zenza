
import {Entrypoint} from '../types';

const metadata: Entrypoint = {
  entry: {
    import: './src/setting.ts',
    filename: 'ZenzaAdvancedSettings.user.js',
  },
  metadata: {
    contributor: 'segabito macmoto',
    version: '0.3.2',
    name: 'ZenzaWatch 上級者用設定',
    description: 'ZenzaWatchの上級者向け設定。変更する時だけ有効にすればOK',
    include: '*//www.nicovideo.jp/my*',
    noframes: null,
  },
};


export default metadata;
