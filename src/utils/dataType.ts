export const toType = (value: any): string => {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};
export const isPlainObject = (val: any): val is boolean => toType(val) === 'object';
