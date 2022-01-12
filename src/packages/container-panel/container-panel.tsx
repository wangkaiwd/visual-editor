import { computed, defineComponent, inject, PropType, reactive, toRefs } from 'vue';
import { AppContextKey, AppContextProps } from '@/App';
import './index.less';
import EditorBlock from '@/packages/container-panel/components/editor-block';

export type DragHandler = (e: DragEvent) => void
export default defineComponent({
  name: 'ContainerPanel',
  props: {
    onDragenter: {
      type: Function as PropType<DragHandler>,
      required: true
    },
    onDragover: {
      type: Function as PropType<DragHandler>,
      required: true
    },
    onDrop: {
      type: Function as PropType<DragHandler>,
      required: true
    }
  },
  setup (props) {
    const { data } = inject<AppContextProps>(AppContextKey)!;
    const containerContentStyles = computed(() => {
      const { width, height } = data.value.container;
      return {
        width: `${width}px`,
        height: `${height}px`,
        border: `1px solid black`
      };
    });
    const blocks = computed(() => data.value.blocks);
    const renderBlocks = () => blocks.value.map(block => <EditorBlock block={block}/>);
    return () => (
      <div class="container-panel">
        <div
          class="container-panel-content"
          onDragenter={props.onDragenter}
          onDragover={props.onDragover}
          onDrop={props.onDrop}
          style={containerContentStyles.value}
        >
          {renderBlocks()}
        </div>
      </div>
    );
  },
});
