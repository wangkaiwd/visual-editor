const AutoImport = require('unplugin-auto-import/webpack');
const unpluginElementPlus = require('unplugin-element-plus/webpack').default;
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');
module.exports = {
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      unpluginElementPlus()
    ],
  },
};
