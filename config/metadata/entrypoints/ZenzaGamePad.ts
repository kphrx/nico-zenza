
import {Entrypoint} from '../types';

const metadata: Entrypoint = {
  entry: {
    import: './src/gamepad.ts',
    filename: 'ZenzaGamePad.user.js',
  },
  metadata: {
    contributor: 'segabito macmoto',
    version: '1.5.3',
    description: 'ZenzaWatchをゲームパッドで操作',
    include: '*://*.nicovideo.jp/*',
    noframes: null,
  },
};


export default metadata;
