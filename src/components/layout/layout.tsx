import { defineComponent } from 'vue';
import ComponentsPanel from '@/components/comonents-panel/components-panel';
import ContainerPanel from '@/components/container-panel/container-panel';
import PropsPanel from '@/components/props-panel/props-panel';
import './index.less';
import { ElAside, ElContainer, ElHeader } from 'element-plus';

export default defineComponent({
  name: 'Layout',
  setup () {
    return () => (
      <ElContainer class="layout">
        <ElAside style="border:1px solid pink">
          <ComponentsPanel/>
        </ElAside>
        <ElContainer class="layout-editor" style="border: 1px solid pink">
          <ElHeader style="border: 1px solid blue">
            tool bar
          </ElHeader>
          <ElContainer>
            <ContainerPanel/>
          </ElContainer>
        </ElContainer>
        <ElAside style="border: 1px solid pink">
          <PropsPanel/>
        </ElAside>
      </ElContainer>
    );
  },
});
