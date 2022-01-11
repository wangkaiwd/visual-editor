<template>
  <el-card class="app" :body-style="{height: '100vh'}">
    <el-container class="app-body">
      <el-aside style="border:1px solid pink">
        <components-panel></components-panel>
      </el-aside>
      <el-container class="app-editor" style="border: 1px solid pink">
        <el-header style="border: 1px solid blue">
          tool bar
        </el-header>
        <el-container>
          <container-panel></container-panel>
        </el-container>
      </el-container>
      <el-aside style="border: 1px solid pink">
        <props-panel></props-panel>
      </el-aside>
    </el-container>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import ComponentsPanel from '@/components/comonents-panel/components-panel';
import ContainerPanel from '@/components/container-panel/container-panel';
import PropsPanel from '@/components/props-panel/props-panel';

export default defineComponent({
  name: 'App',
  components: { PropsPanel, ContainerPanel, ComponentsPanel },
  setup () {
    const state = reactive({ count: 0 });
    return {
      ...toRefs(state)
    };
  }
});
</script>

<style lang="less">
@import "assets/styles/vars.less";
.app {
  .app-body {
    height: 100%;
  }
  .app-editor {
    margin: 0 @space-base;
  }
}
</style>
