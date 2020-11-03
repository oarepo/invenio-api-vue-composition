import Vue from 'vue'
import VueRouter from 'vue-router'
import { collection, record, collectionApi } from '@oarepo/invenio-api-vue-composition'
import CollectionViewer from '../components/CollectionViewer.vue'
import RecordViewer from '../components/RecordViewer.vue'
import RecordEditor from '../components/RecordEditor.vue'
import RecordViewerEditor from '../components/RecordViewerEditor.vue'
import RecordCreator from '../components/RecordCreator.vue'

Vue.use(VueRouter)

const routes = [
  collectionApi({
    // can not put this directly to collection below as vue does not have a negative lookahead in router
    // and we do not want to nest record inside the collection (so that collection is not unnecessarily
    // fetched when record is shown)
    //
    // to make this scenario easier, collectionApi injects ``collection-api`` prop initialized with
    // the current collection code. No request is performed at this time.
    path: '/create',
    collectionCode: 'records',
    component: RecordCreator
  }, {
    name: 'record-creator'
  }),

  record({
    // path is implicitely '/${collectionCode}'  -we want the records in the root, so have to create it manually
    path: '/:recordId',
    collectionCode: 'records',
    component: RecordViewerEditor
  }, {
    name: 'record-viewer-editor',
    props: {
      extraProperty: 1
    },
    children: [
      {
        path: 'edit',
        component: RecordEditor,
        name: 'record-editor'
      },
      {
        path: '',
        component: RecordViewer,
        name: 'record-viewer'
      }
    ]
  }),

  collection({
      path: '/',
      collectionCode: 'records',
      component: CollectionViewer,
      recordRouteName: 'record-viewer'
    },
    {
      name: 'record-list',
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
