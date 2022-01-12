import { defineComponent, inject } from 'vue';
import ComponentsPanel from '@/packages/comonents-panel/components-panel';
import ContainerPanel, { DragHandler } from '@/packages/container-panel/container-panel';
import PropsPanel from '@/packages/props-panel/props-panel';
import './index.less';
import { ElAside, ElContainer, ElHeader } from 'element-plus';
import { RegisterParams } from '@/config/editor';
import { AppContextKey, AppContextProps } from '@/App';
import { deepClone } from '@/utils/helper';

export default defineComponent({
  name: 'Layout',
  setup () {
    const { data, changeData } = inject<AppContextProps>(AppContextKey)!;
    let draggingElement: RegisterParams | undefined = undefined;
    const onDragstart = (e: DragEvent, component: RegisterParams) => {
      console.log('e-item-dragstart', e);
      draggingElement = component;
    };
    const onDragend: DragHandler = (e) => {
      console.log('e-item-dragend', e);
      draggingElement = undefined;
    };

    const onDragenter: DragHandler = (e) => {
      console.log('drag enter');
      // cursor style will change
      e.preventDefault();
    };
    const onDragover: DragHandler = (e) => {
      console.log('drag over');
      e.preventDefault();
    };
    const onDrop: DragHandler = (e) => {
      console.log('drop', e);
      const dataCopy = deepClone(data.value);
      if (draggingElement) {
        dataCopy.blocks.push({
          left: 0,
          top: 0,
          key: draggingElement.key
        });
        changeData(dataCopy);
      }
      e.preventDefault();
    };
    return () => (
      <ElContainer class="layout">
        <ElAside style="border:1px solid pink">
          <ComponentsPanel onDragstart={onDragstart} onDragend={onDragend}/>
        </ElAside>
        <ElContainer class="layout-editor" style="border: 1px solid pink">
          <ElHeader style="border: 1px solid blue">
            tool bar
          </ElHeader>
          <ElContainer class="layout-container-wrapper">
            <ContainerPanel
              onDragenter={onDragenter}
              onDragover={onDragover}
              onDrop={onDrop}
            />
          </ElContainer>
        </ElContainer>
        <ElAside style="border: 1px solid pink">
          <PropsPanel/>
        </ElAside>
      </ElContainer>
    );
  },
});
