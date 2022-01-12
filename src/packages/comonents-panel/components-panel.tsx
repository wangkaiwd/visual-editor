import { defineComponent, inject, reactive, toRefs } from 'vue';
import './index.less';
import { AppContextKey, AppContextProps } from '@/App';
import { ElCard, ElSpace } from 'element-plus';

export default defineComponent({
  name: 'ComponentsPanel',
  components: {},
  props: {
    onDragstart: {
      type: Function,
      required: true
    },
    onDragend: {
      type: Function,
      required: true
    },
  },
  setup (props, { emit }) {
    const { config } = inject<AppContextProps>(AppContextKey)!;
    const renderComponents = () => config.componentList.map(c =>
      <div draggable="true"
           class={'components-panel-item'}
           onDragstart={(e) => props.onDragstart(e, c)}
           onDragend={(e) => props.onDragend(e, c)}
      >
        <ElCard header={c.label} shadow={'never'}>
          {c.preview()}
        </ElCard>
      </div>
    );
    return () => {
      return (
        <div class="components-panel">
          <ElSpace class={'components-panel-space'} direction={'vertical'} fill={true}>
            {renderComponents()}
          </ElSpace>
        </div>
      );
    };
  }
});
