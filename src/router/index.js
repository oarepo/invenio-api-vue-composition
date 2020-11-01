import Vue from 'vue'
import VueRouter from 'vue-router'
import { collection, record } from '@oarepo/invenio-api-vue-composition'
import CollectionViewer from '../components/CollectionViewer.vue'
import RecordViewer from '../components/RecordViewer.vue'

Vue.use(VueRouter)

const routes = [
  record({
    collectionCode: 'records',
    viewerComponent: RecordViewer
  }, {
    name: 'record'
  }),
  collection({
      path: '/',
      collectionCode: 'records',
      viewerComponent: CollectionViewer,
      recordRouteName: 'record'
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
