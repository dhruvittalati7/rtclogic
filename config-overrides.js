const rewireReactHotLoader = require('react-app-rewire-hot-loader')
// const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

module.exports = function override(config, env) {
  config = rewireReactHotLoader(config, env)
  // config.plugins = config.plugins.map(plugin => {
  //   if (plugin.constructor.name === 'GenerateSW') {
  //     return new WorkboxWebpackPlugin.InjectManifest({
  //       swSrc: './src/sw.js',
  //       swDest: 'service-worker.js',
  //     })
  //   }
  //
  //   return plugin
  // })
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-dom': '@hot-loader/react-dom',
  }
  return config
}
