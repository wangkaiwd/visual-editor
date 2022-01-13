import { computed, defineComponent, inject, ref, toRefs } from 'vue';
import './index.less';
import { AppContextKey, AppContextProps } from '@/App';

export default defineComponent({
  name: 'EditorBlock',
  props: {
    block: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const { block } = props;
    const blockRef = ref<HTMLDivElement | null>(null);
    const blockStyle = computed(() => {
      let { left, top } = block;
      if (block.alignCenter) {
        if (blockRef.value) {
          const { width, height } = blockRef.value.getBoundingClientRect();
          left = left - width / 2;
          top = top - height / 2;
        }
      }
      return {
        left: left + 'px',
        top: top + 'px'
      };
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
