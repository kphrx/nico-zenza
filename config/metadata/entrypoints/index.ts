
import {EntryObject} from 'webpack';
import {UserScriptMetadata, Entrypoint} from '../types';
// import CapTube from './CapTube';
// import HeatSync from './HeatSync';
// import MaskedWatch from './MaskedWatch';
// import MylistFilter from './MylistFilter';
// import MylistPocket from './MylistPocket';
// import ZenzaAdvancedSettings from './ZenzaAdvancedSettings';
// import ZenzaBlogPartsButton from './ZenzaBlogPartsButton';
// import ZenzaGamePad from './ZenzaGamePad';
// import ZenzaHLS from './ZenzaHLS';
// import ZenzaWatch from './ZenzaWatch';
// import uQuery from './uQuery';

//   Navi: './src/navi.ts',
//   Yomi: './src/yomi.ts',
//   VoiceControl: './src/vc.ts',
const entrypoints: {[key: string]: Entrypoint} = {};

const entry: EntryObject = Object.fromEntries(
    Object.entries(entrypoints).map(([k, v]) => [k, v.entry]),
);

const metadata: {
  [key: string]: UserScriptMetadata;
} = Object.fromEntries(
    Object.entries(entrypoints).map(([k, v]) => [k, v.metadata]),
);

export {
  entry,
  metadata,
};
