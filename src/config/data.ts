import { Ref, UnwrapRef } from '@vue/reactivity';
import { PlainObject } from '@/utils/types';

export type RefData = Ref<UnwrapRef<DataSource>>

export interface DataSource {
  container: PlainObject,
  blocks: PlainObject[]
}

export const dataSource: DataSource = {
  container: {
    width: 800,
    height: 800
  },
  blocks: [
    { left: 100, top: 100, key: 'text' },
    { left: 200, top: 200, key: 'button' },
    { left: 300, top: 300, key: 'input' },
  ]
};
