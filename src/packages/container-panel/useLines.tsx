import { PlainObject } from '@/utils/types';
import { Ref } from '@vue/reactivity';
import { IX, IY, MoveContext } from '@/packages/container-panel/types';

export const useLines = (unFocusBlocks: Ref<PlainObject[]>) => {
  const calcLines = (movingBlock: PlainObject) => {
    const x: IX[] = [], y: IY[] = [];
    const { width: widthA, height: heightA } = movingBlock;
    unFocusBlocks.value.forEach((block) => {
      const { width: widthB, height: heightB, top: topB, left: leftB } = block;
      y.push({ lineTop: topB, blockTop: topB }); // 上对上
      y.push({ lineTop: topB, blockTop: topB - heightA }); // 上对下
      y.push({ lineTop: topB + heightB / 2, blockTop: topB + heightB / 2 - heightA / 2 }); // 中对中
      y.push({ lineTop: topB + heightB, blockTop: topB + heightB - heightA }); // 下对下
      y.push({ lineTop: topB + heightB, blockTop: topB + heightB }); // 下对上

      x.push({ lineLeft: leftB, blockLeft: leftB }); // 左对左
      x.push({ lineLeft: leftB, blockLeft: leftB - widthA }); // 左对右
      x.push({ lineLeft: leftB + widthB / 2, blockLeft: leftB + widthB / 2 - widthA / 2 }); // 中对中
      x.push({ lineLeft: leftB + widthB, blockLeft: leftB + widthB - widthA }); // 右对右
      x.push({ lineLeft: leftB + widthB, blockLeft: leftB + widthB }); // 右对左
    });
    return { x, y };
  };
  const findY = (top: number, linesY: IY[]) => {
    let y = -1;
    let blockY: number | undefined = undefined;
    for (let i = 0; i < linesY.length; i++) {
      const { blockTop, lineTop } = linesY[i];
      if (Math.abs(top - blockTop) < 4) { // find it
        y = lineTop;
        blockY = blockTop;
        break;
      }
    }
    return { y, blockY };
  };
  const findX = (top: number, linesX: IX[]) => {
    let x = -1;
    let blockX: number | undefined = undefined;
    for (let i = 0; i < linesX.length; i++) {
      const { blockLeft, lineLeft } = linesX[i];
      if (Math.abs(top - blockLeft) < 4) { // find it
        x = lineLeft;
        blockX = blockLeft;
        break;
      }
    }
    return { x, blockX };
  };
  return {
    calcLines,
    findX,
    findY
  };
};
