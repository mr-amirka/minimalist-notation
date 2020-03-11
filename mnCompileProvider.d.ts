import {IAttrsMap, IMNPreset} from "./global";

declare const compileProvider: (presets: IMNPreset[]) => (attrsMap: IAttrsMap) => string;
export = compileProvider;
