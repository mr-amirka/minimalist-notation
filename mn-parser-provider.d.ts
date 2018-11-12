
import { attrsMap } from './index';

declare const parserProvider: (attrs: string[]) => ((dst: attrsMap, text: string) => number) | null;
export = parserProvider;
