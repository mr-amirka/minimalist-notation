/**
 * @overview minimalist-notation/parserProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {IAttrsMap} from "./global";

declare function parserProvider(attrs: string | string[] | {[from: string]: string})
  : ((output: IAttrsMap, content: string) => number) | null;
export = parserProvider;
