import { defineComponent } from 'vue';
import Layout from '@/components/layout/layout';
import { ElCard } from 'element-plus';

export default defineComponent({
  name: 'App',
  setup () {
    return () => (
      <ElCard class="app" bodyStyle={{ height: '100vh' }}>
        <Layout/>
      </ElCard>
    );
  }
});
