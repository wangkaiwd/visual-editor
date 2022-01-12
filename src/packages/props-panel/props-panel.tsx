import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
  name: 'PropsPanel',
  setup () {
    return () => {
      return (<div>属性面板</div>);
    };
  },
});
