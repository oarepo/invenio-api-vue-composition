import Vue from 'vue'
import VueRouter from 'vue-router'
import { collection } from '@oarepo/invenio-api-vue-composition'
import CollectionViewer from '../components/CollectionViewer.vue'

Vue.use(VueRouter)

const routes = [
  collection({
      path: '/',
      collectionCode: 'records',
      viewerComponent: CollectionViewer,
      recordRouteName: 'record',
    },
    {
      name: 'recordList',
      meta: {
        query: {
          size: 'int:3' // small page size for demo
        }
      }
    }
  )
]

const router = new VueRouter({
  routes
})

export default router
