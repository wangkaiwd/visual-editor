import { PlainObject } from '@/utils/types';

export const deepClone = (obj: PlainObject) => {
  return JSON.parse(JSON.stringify(obj));
};
