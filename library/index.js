// @flow

import { useInvenioOptions } from './invenio/options'
import { useInvenioCollection } from './invenio/collection'
import { useInvenioRecord } from './invenio/record'

// $FlowIgnore
import SimpleErrorComponent from './components/SimpleErrorComponent.vue'

export type * from './types'
export * from './router'


export {
  useInvenioCollection,
  useInvenioRecord,
  useInvenioOptions,
  SimpleErrorComponent
}
