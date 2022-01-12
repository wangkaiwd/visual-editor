import { computed, defineComponent, inject, toRefs } from 'vue';
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
    const blockStyle = computed(() => {
      return {
        left: block.left + 'px',
        top: block.top + 'px'
      };
    });
    const { config } = inject<AppContextProps>(AppContextKey)!;
    return () => {
      const { componentMap } = config;
      const renderComponent = componentMap[block.key].render();
      return (
        <div class="editor-block" style={blockStyle.value}>
          {renderComponent}
        </div>
      );
    };
  },
});
