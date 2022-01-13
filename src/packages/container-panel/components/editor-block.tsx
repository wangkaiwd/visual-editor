import { computed, defineComponent, inject, onMounted, ref } from 'vue';
import './index.less';
import { AppContextKey, AppContextProps } from '@/App';
import { deepClone } from '@/utils/helper';

export default defineComponent({
  name: 'EditorBlock',
  props: {
    block: {
      type: Object,
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
    const { config } = inject<AppContextProps>(AppContextKey)!;
    return () => {
      const { componentMap } = config;
      const renderComponent = componentMap[block.key].render();
      return (
        <div class="editor-block" style={blockStyle.value} ref={blockRef}>
          {renderComponent}
        </div>
      );
    };
  },
});
