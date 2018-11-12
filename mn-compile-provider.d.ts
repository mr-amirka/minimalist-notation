import { MnPreset, attrsMap } from './index';

declare const compileProvider: (presets: MnPreset[]) => (attrsMap: attrsMap) => string;
export = compileProvider;
