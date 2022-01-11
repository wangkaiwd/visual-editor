<template>
  <el-button>hhh</el-button>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
  name: 'App',
  components: {},
  setup () {
    const state = reactive({ count: 0 });
    return {
      ...toRefs(state)
    };
  }
});
</script>

<style lang="less">
#app {
}
</style>
