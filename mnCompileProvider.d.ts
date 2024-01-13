import {IAttrsMap, IMinimalistNotationOptions} from "./global";

declare const compileProvider: (
  options: IMinimalistNotationOptions,
) => (attrsMap: IAttrsMap) => string;
export = compileProvider;
