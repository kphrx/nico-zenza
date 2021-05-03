/* global __dirname */
import {resolve} from 'path';
import {merge} from 'webpack-merge';
import {Configuration} from 'webpack';
import MetadataPlugin from './config/metadata';

import devConfig from './config/webpack.dev.config';
import prodConfig from './config/webpack.prod.config';

const metadata = {
  ZenzaWatch: {
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

const config: Configuration = {
  resolve: {
    extensions: ['.js', '.ts'],
  },
  optimization: {
    minimize: false,
    moduleIds: 'named',
  },
  entry: {
    // ZenzaWatch: './src/watch.ts',
    // uQuery: './src/uquery.ts',
    // MylistPocket: './src/pocket.ts',
    // MaskedWatch: './src/shape.ts',
    // ZenzaAdvancedSettings: './src/setting.ts',
    // ZenzaHLS: './src/hls.ts',
    // ZenzaGamePad: './src/gamepad.ts',
    // ZenzaBlogPartsButton: './src/blog.ts',
    // CapTube: './src/captube.ts',
    // MylistFilter: './src/my4.ts',
    // HeatSync: './src/heatsync.ts',
    // Navi: './src/navi.ts',
    // Yomi: './src/yomi.ts',
    // VoiceControl: './src/vc.ts',
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].user.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new MetadataPlugin(metadata),
  ],
};

export default (env: {
  development?: boolean
  production?: boolean
}): Configuration => {
  if (env.development) {
    return merge<Configuration>(config, devConfig);
  }
  if (env.production) {
    return merge<Configuration>(config, prodConfig);
  }
  throw new Error('No matching configuration was found!');
};
