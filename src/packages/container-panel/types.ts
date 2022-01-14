import { PlainObject } from '@/utils/types';

export interface IX {
  lineLeft: number;
  blockLeft: number;
}

export interface IY {
  lineTop: number,
  blockTop: number
}

export interface MoveContext {
  movingBlock?: PlainObject;
  movingIndex: number;
  lines: { x: IX[], y: IY [] };
}
