import { computed, defineComponent, inject, onBeforeUnmount, PropType, reactive, ref } from 'vue';
import { AppContextKey, AppContextProps } from '@/App';
import './index.less';
import EditorBlock from '@/packages/container-panel/components/editor-block';
import { deepClone } from '@/utils/helper';
import { DataSource } from '@/config/data';
import { DragHandler, PlainObject } from '@/utils/types';
import { useClickOutside } from '@/hooks/clickOutside';
import { useLines } from '@/packages/container-panel/useLines';
import { MoveContext } from '@/packages/container-panel/types';

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
    const { data, changeData } = inject<AppContextProps>(AppContextKey)!;
    const containerContentStyles = computed(() => {
      const { width, height } = data.value.container;
      return {
        width: `${width}px`,
        height: `${height}px`,
        border: `1px solid black`
      };
    });
    const blocks = computed(() => data.value.blocks);
    const guideLine = reactive({ x: -1, y: -1 });

    function createMoveContext (): MoveContext {
      return {
        movingBlock: undefined,
        movingIndex: -1,
        lines: { x: [], y: [] }
      };
    }

    const blockRefs = ref<HTMLDivElement[]>([]);
    const moveContext = createMoveContext();
    const focusBlocks = computed(() => data.value.blocks.filter(block => block.focus));
    const unFocusBlocks = computed(() => data.value.blocks.filter(block => !block.focus));
    const clearFocus = () => {
      const dataCopy: DataSource = deepClone(data.value);
      dataCopy.blocks.forEach(block => { block.focus = false; });
      changeData(dataCopy);
    };
    useClickOutside(document, blockRefs, clearFocus);
    const { calcLines, findX, findY } = useLines(unFocusBlocks);
    const onMousedown = (e: MouseEvent, i: number, block: PlainObject) => {
      // console.log('mosuedown', e);
      moveContext.movingBlock = block;
      moveContext.movingIndex = i;
      document.addEventListener('mousemove', onMousemove);
      document.addEventListener('mouseup', onMouseup);
      if (!block.focus) {
        if (!e.shiftKey) { // not support all key
          clearFocus();
        }
        const dataCopy = deepClone(data.value);
        dataCopy.blocks[i].focus = true;
        changeData(dataCopy);
      }
      moveContext.lines = calcLines(block);
    };
    const updateGuideLine = (moveX: number, moveY: number) => {
      const { movingIndex, lines } = moveContext;
      const current = blocks.value[movingIndex];
      const top = current.top + moveX;
      const left = current.left + moveY;
      guideLine.y = findY(top, lines.y);
      guideLine.x = findX(left, lines.x);
    };
    const moveBlocks = (moveX: number, moveY: number) => {
      const dataCopy = deepClone(data.value);
      const blocksMap = dataCopy.blocks.reduce((memo: PlainObject, block: PlainObject) => {
        memo[block.id] = block;
        return memo;
      }, {});
      focusBlocks.value.forEach((block) => {
        const blockCopy = blocksMap[block.id];
        blockCopy.left += moveX;
        blockCopy.top += moveY;
      });
      changeData(dataCopy);
    };
    const onMousemove = (e: MouseEvent) => {
      const { movingBlock, movingIndex, lines } = moveContext;
      if (!movingBlock) {return;}
      if (!focusBlocks.value.length) {return;}
      const moveX = e.movementX;
      const moveY = e.movementY;
      updateGuideLine(moveX, moveY);
      moveBlocks(moveX, moveY);
    };

    const onMouseup = (e: MouseEvent) => {
      moveContext.movingIndex = -1;
      moveContext.movingBlock = undefined;
      moveContext.lines = { x: [], y: [] };
      guideLine.x = -1;
      guideLine.y = -1;
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
    };
    const renderBlocks = () => blocks.value.map((block, i) => (
      <EditorBlock
        onMousedown={(e: MouseEvent) => onMousedown(e, i, block)}
        key={block.id}
        ref={(el: any) => {blockRefs.value[i] = el.$el as HTMLDivElement;}}
        index={i}
        block={block}
      />)
    );
    onBeforeUnmount(() => {
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
    });
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
          {guideLine.x !== -1 && <div class={'container-panel-content-guide-y'} style={{ left: guideLine.x + 'px' }}/>}
          {guideLine.y !== -1 && <div class={'container-panel-content-guide-x'} style={{ top: guideLine.y + 'px' }}/>}
        </div>
      </div>
    );
  },
});
