import { defineComponent, reactive, toRefs } from 'vue';
import './index.less';

export default defineComponent({
  name: 'ComponentsPanel',
  components: {},
  setup () {
    return () => {
      return (
        <div class="components-panel">
          组件列表
        </div>
      );
    };
  }
});
