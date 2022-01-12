import { defineComponent, provide, ref } from 'vue';
import Layout from '@/packages/layout/layout';
import { ElCard } from 'element-plus';
import { DataSource, dataSource, RefData } from '@/config/data';
import config, { Config } from '@/config/editor';

export interface AppContextProps {
  data: RefData,
  changeData: (newData: DataSource) => void,
  config: Config
}

export const AppContextKey = 'data';
export default defineComponent({
  name: 'App',
  setup () {
    // data.value = reactive(dataSource)
    const data = ref(dataSource);
    const changeData = (newData: DataSource) => data.value = newData;
    provide<AppContextProps>(AppContextKey, { data, changeData, config });
    return () => (
      <ElCard class="app" bodyStyle={{ height: '100vh' }}>
        <Layout/>
      </ElCard>
    );
  }
});
