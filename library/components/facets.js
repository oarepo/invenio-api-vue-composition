import { ArrayDatatype } from '@oarepo/vue-query-synchronizer'

export function useFacetModels(collectionApi, vm) {
  return (() => {
    const f = collectionApi.facets
    if (!f.value) {
      return f.value
    }
    return f.value.map(facet => {
      Object.defineProperty(facet,'enabled', {
        get() {
          return vm.$query.facets.includes(facet.code)
        },
        set(value) {
          if (value) {
            vm.$query.addValue('facets', facet.code)
          } else {
            vm.$query.removeValue('facets', facet.code)
          }
          return true
        },
        enumerable: true,
        configurable: true
      })
      vm.$query.define(facet.code, ArrayDatatype, [])
      Object.defineProperty(facet,'model', {
        get() {
          return vm.$query[facet.code]
        },
        set(value) {
          vm.$query[facet.code] = value
          return true
        },
        enumerable: true,
        configurable: true
      })
      return facet
    })
  })
}
