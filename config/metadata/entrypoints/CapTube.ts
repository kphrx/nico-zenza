
import {Entrypoint} from '../types';

const metadata: Entrypoint = {
  entry: {
    import: './src/captube.ts',
    filename: 'CapTube.user.js',
  },
  metadata: {
    version: '0.0.11',
    description: '"S"キーでYouTubeのスクリーンショット保存',
    include: [
      'https://www.youtube.com/*',
      'https://www.youtube.com/embed/*',
      'https://youtube.com/*',
    ],
  },
};


export default metadata;
