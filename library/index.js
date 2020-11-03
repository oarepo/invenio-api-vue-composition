// @flow

import { useInvenioOptions } from './invenio/options'
import { useInvenioCollection } from './invenio/collection'
import { useInvenioRecord } from './invenio/record'
import SimpleErrorComponent from './components/SimpleErrorComponent.vue'

// just for rendering of types, it seems that documentation.js does not follow "import type"
import _ from './types'
() => {_}

export type * from './types'
export * from './router'


export {
  useInvenioCollection,
  useInvenioRecord,
  useInvenioOptions,
  SimpleErrorComponent
}
