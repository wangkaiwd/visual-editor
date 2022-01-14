import { onBeforeUnmount, onMounted } from 'vue';
import { AnyFunction } from '@/utils/types';
import { Ref } from '@vue/reactivity';

export const useClickOutside = function (clickElement: HTMLDocument | HTMLElement, exceptElements: Ref<HTMLElement[]>, cb: AnyFunction) {
  const contains = (node: Node) => {
    return exceptElements.value.some(el => el.contains(node));
  };
  const onClickBody = (e: Event) => {
    if (!contains(e.target as Node)) {
      cb();
    }
  };
  onMounted(() => {
    clickElement.addEventListener('click', onClickBody);
  });
  onBeforeUnmount(() => {
    clickElement.removeEventListener('click', onClickBody);
  });
};
