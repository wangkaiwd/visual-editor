import { RenderFunction } from 'vue';
import { ElButton, ElInput } from 'element-plus';

export interface RegisterParams {
  key: string;
  label: string;
  preview: RenderFunction;
  render: RenderFunction;
}

export interface ComponentMap {
  [k: string]: RegisterParams;
}

export interface Config {
  register (props: RegisterParams): void;

  componentList: RegisterParams[];
  componentMap: ComponentMap;
}

const createEditorConfig = (): Config => {
  const componentList: RegisterParams[] = [];
  const componentMap: ComponentMap = {};
  return {
    register (props: RegisterParams) {
      componentList.push(props);
      componentMap[props.key] = props;
    },
    componentList,
    componentMap
  };
};

const config = createEditorConfig();
config.register({
  label: '文本',
  key: 'text',
  preview: () => '预览文本',
  render: () => '渲染文本'
});

config.register({
  label: '按钮',
  key: 'button',
  preview: () => <ElButton>预览按钮</ElButton>,
  render: () => <ElButton>渲染按钮</ElButton>
});

config.register({
  label: '输入框',
  key: 'input',
  preview: () => <ElInput placeholder={'预览输入框'}/>,
  render: () => <ElInput placeholder={'渲染输入框'}/>,
});

export default config;
