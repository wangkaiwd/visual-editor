import { computed, defineComponent, inject, onMounted, PropType, ref } from 'vue';
import './index.less';
import { AppContextKey, AppContextProps } from '@/App';
import { deepClone } from '@/utils/helper';
import { classNames } from '@/utils/classNames';
import { MouseEventHandler } from '@/utils/types';

export default defineComponent({
  name: 'EditorBlock',
  props: {
    block: {
      type: Object,
      required: true
    },
    onMousedown: {
      type: Function as PropType<MouseEventHandler>,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  setup (props) {
    // must be careful use child property directly
    const { block } = props;
    const { changeData, data } = inject<AppContextProps>(AppContextKey)!;
    const blockRef = ref<HTMLDivElement | null>(null);
    const blockStyle = computed(() => { // block
      return {
        left: props.block.left + 'px',
        top: props.block.top + 'px'
      };
    });
    const dataCopy = deepClone(data.value);
    onMounted(() => {
      if (blockRef.value && block.alignCenter) {
        const { width, height } = blockRef.value.getBoundingClientRect();
        const item = dataCopy.blocks[props.index];
        item.left -= width / 2;
        item.top -= height / 2;
        changeData(dataCopy);
      }
    });
    const onMousedown = (e: MouseEvent) => {
      props.onMousedown(e);
    };
    const { config } = inject<AppContextProps>(AppContextKey)!;
    return () => {
      const { componentMap } = config;
      const renderComponent = componentMap[block.key].render();
      return (
        <div
          class={classNames(['editor-block', { focus: props.block.focus }])}
          style={blockStyle.value}
          ref={blockRef}
          onMousedown={onMousedown}
        >
          {renderComponent}
        </div>
      );
    };
  },
});
