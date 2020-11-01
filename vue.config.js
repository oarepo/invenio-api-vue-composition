const path = require('path')
const useProxy = true

const exp = {}

if (useProxy) {
  exp['devServer'] = {
    https: true,
    proxy: {
      '^/api': {
        target: 'https://localhost:5000',
        changeOrigin: false
      }
    }
  }
}

module.exports = {
  transpileDependencies: [
    'swrv'
  ],
  configureWebpack(cfg) {
    cfg.resolve.alias['@oarepo/invenio-api-vue-composition'] = path.join(__dirname, 'library/index.js')
  },
  ...exp
}
