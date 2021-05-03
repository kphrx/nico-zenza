
import {EntryObject} from 'webpack';
import {UserScriptMetadata, Entrypoint} from '../types';
// import ZenzaWatch from './ZenzaWatch';
// import uQuery from './uQuery';
// import MylistPocket from './MylistPocket';
// import MaskedWatch from './MaskedWatch';
// import ZenzaAdvancedSettings from './ZenzaAdvancedSettings';
// import ZenzaHLS from './ZenzaHLS';
// import ZenzaGamePad from './ZenzaGamePad';
// import ZenzaBlogPartsButton from './ZenzaBlogPartsButton';
// import CapTube from './CapTube';
// import MylistFilter from './MylistFilter';
// import HeatSync from './HeatSync';
// import Navi from './Navi';
// import Yomi from './Yomi';
// import VoiceControl from './VoiceControl';

//   ZenzaWatch: './src/watch.ts',
//   uQuery: './src/uquery.ts',
//   MylistPocket: './src/pocket.ts',
//   MaskedWatch: './src/shape.ts',
//   ZenzaAdvancedSettings: './src/setting.ts',
//   ZenzaHLS: './src/hls.ts',
//   ZenzaGamePad: './src/gamepad.ts',
//   ZenzaBlogPartsButton: './src/blog.ts',
//   CapTube: './src/captube.ts',
//   MylistFilter: './src/my4.ts',
//   HeatSync: './src/heatsync.ts',
//   Navi: './src/navi.ts',
//   Yomi: './src/yomi.ts',
//   VoiceControl: './src/vc.ts',
const entrypoints: {[key: string]: Entrypoint} = {};

const entry: EntryObject = Object.fromEntries(
    Object.entries(entrypoints).map(([k, v]) => [k, v.entry]),
);

const metadata: {
  [key: string]: UserScriptMetadata
} = Object.fromEntries(
    Object.entries(entrypoints).map(([k, v]) => [k, v.metadata]),
);

export {
  entry,
  metadata,
};
