import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import VueI18n from 'vue-i18n'

import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueCompositionAPI)

Vue.use(VueI18n)

const dateTimeFormats = {
  'en-US': {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'short', day: 'numeric',
      weekday: 'short', hour: 'numeric', minute: 'numeric'
    }
  },
}

const i18n = new VueI18n({
  locale: 'en-US',
  messages: {
  },
  dateTimeFormats
})

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
