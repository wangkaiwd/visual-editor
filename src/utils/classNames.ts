// cls({focus: true})
// cls(['a',{focus:true},{}])
// cls('a','b','c')
// https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads

import { isPlainObject } from '@/utils/dataType';

interface IName {
  [k: string]: boolean;
}

export function classNames (...args: string[]): string

export function classNames (names: (string | IName)[]): string

export function classNames (...args: any[]): string {
  let result: string[] = [];
  const firstArg = args[0];
  if (Array.isArray(firstArg)) {
    firstArg.forEach(arg => {
      if (typeof arg === 'string') {
        result.push(arg);
      } else if (isPlainObject(arg)) {
        for (const key in arg as any) {
          if (arg.hasOwnProperty(key)) {
            (arg as any)[key as any] && result.push(key);
          }
        }
      }
    });
  } else {
    result = args;
  }
  return result.join(' ');
}
