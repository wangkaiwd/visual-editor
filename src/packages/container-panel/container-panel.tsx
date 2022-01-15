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
import { useCommand } from '@/packages/layout/useCommand';

interface FinalPosition {
  blockY?: number;
  blockX?: number;
}

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
        movingIndex: -1,
        lines: { x: [], y: [] }
      };
    }

    const blockRefs = ref<HTMLDivElement[]>([]);
    const finalPosition = reactive<FinalPosition>({ blockY: undefined, blockX: undefined });
    const moveContext = reactive<MoveContext>(createMoveContext());
    const moving = computed(() => moveContext.movingIndex !== -1);
    const { addCommand } = useCommand();
    const currentMovingBlock = computed(() => {
      const { movingIndex } = moveContext;
      return blocks.value[movingIndex];
    });
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

    function moveBlocks (moveX: number, moveY: number) {
      const dataCopy = deepClone(data.value);
      const blocksMap = dataCopy.blocks.reduce((memo: PlainObject, block: PlainObject) => {
        memo[block.id] = block;
        return memo;
      }, {});
      focusBlocks.value.forEach((block) => {
        const blockCopy = blocksMap[block.id];
        blockCopy.left = blockCopy.left + moveX;
        blockCopy.top = blockCopy.top + moveY;
      });
      changeData(dataCopy);
    }

    const updateGuideLineAndFinalPosition = (moveX: number, moveY: number) => {
      const { lines } = moveContext;
      const top = currentMovingBlock.value.top + moveX;
      const left = currentMovingBlock.value.left + moveY;
      const { y, blockY } = findY(top, lines.y);
      const { x, blockX } = findX(left, lines.x);
      guideLine.y = y;
      guideLine.x = x;
      finalPosition.blockX = blockX;
      finalPosition.blockY = blockY;
    };
    const onMousemove = (e: MouseEvent) => {
      if (!moving.value) {return;}
      if (!focusBlocks.value.length) {return;}
      const moveX = e.movementX;
      const moveY = e.movementY;
      updateGuideLineAndFinalPosition(moveX, moveY);
      moveBlocks(moveX, moveY);
    };
    const finalMove = () => {
      const { left, top } = currentMovingBlock.value;
      let moveX = 0, moveY = 0;
      if (finalPosition.blockX) {
        moveX = finalPosition.blockX - left;
      }
      if (finalPosition.blockY) {
        moveY = finalPosition.blockY - top;
      }
      moveBlocks(moveX, moveY);
    };
    const onMouseup = (e: MouseEvent) => {
      finalMove();
      moveContext.movingIndex = -1;
      moveContext.lines = { x: [], y: [] };
      guideLine.x = -1;
      guideLine.y = -1;
      finalPosition.blockY = undefined;
      finalPosition.blockX = undefined;
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
      addCommand();
    };
    const renderBlocks = () => blocks.value.map((block, i) => (
      <EditorBlock
        onMousedown={(e: MouseEvent) => onMousedown(e, i, block)}
        key={block.id}
        ref={(el: any) => {
          if (el) {blockRefs.value[i] = el.$el as HTMLDivElement;}
        }}
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
