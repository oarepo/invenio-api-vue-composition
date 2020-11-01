<template>
    <component
            :is="currentComponent"
            :collection-api="collectionApi"
            :records="collectionApi.records.value"
            :facets="facets"
            :loading="collectionApi.loading.value"
            :loaded="collectionApi.loaded.value"
            :error="collectionApi.error.value"
            :stale="collectionApi.stale.value"
            :pages="collectionApi.pages.value"
            :page="$query.page"
            :pageSize="$query.size"
            :query="$query.q"
            :reload="collectionApi.reload"
            @reload="collectionApi.reload"
            @nextPage="nextPage"
            @prevPage="prevPage"
            @setPage="setPage"
            @setPageSize="setPageSize"
            @search="search"
    ></component>
</template>
<script>
import { computed, defineComponent, getCurrentInstance, watch } from '@vue/composition-api'
import { useInvenioCollection } from '..'
import { ArrayDatatype } from '@oarepo/vue-query-synchronizer'
import {selectComponent} from './componentSelector'

export default defineComponent({
  name: 'invenio-collection-wrapper',
  props: {
    collectionCode: {
      required: true,
      type: String
    },
    viewerComponent: {
      required: true,
      type: [Object, Function]
    },
    loadingComponent: {
      type: [Object, Function],
      default: undefined
    },
    errorComponent: {
      type: [Object, Function],
      default: undefined
    },
    apiUrl: {
      type: String,
      default: '/api'
    },
    recordRouteName: {
      type: String
    },
    httpOptionsProps: {
      type: Object
    },
    httpGetProps: {
      type: Object
    }
  },
  setup(props) {
    const vm = getCurrentInstance()
    const getProps = {
      uiLinkTransformer(record) {
        return {
          name: props.recordRouteName,
          params: {
            recordId: record.id
          }
        }
      },
      ...(props.httpGetProps || [])
    }
    const collectionApi = useInvenioCollection(props.apiUrl, getProps, props.httpOptionsProps)

    function reload() {
      collectionApi.load(props.collectionCode, vm.$query, true)
    }
    watch(computed(() => vm.$query.__self.incr), () => {
      console.log('query changed, loading ...', vm.$query.__self.incr, JSON.stringify(vm.$query))
      reload()
    })
    watch(props, reload)

    reload()

    const currentComponent = selectComponent (
      () => collectionApi.records.value,
      () => collectionApi.error.value,
      props)

    function nextPage() {
      if (vm.$query.page < collectionApi.pages.value) {
        vm.$query.page++
      }
    }

    function prevPage() {
      if (vm.$query.page > 1) {
        vm.$query.page--
      }
    }

    function setPage(page) {
      if (page >= 1 && page <= collectionApi.pages.value) {
        vm.$query.page = page
      }
    }

    function setPageSize(pageSize) {
      if (pageSize > 0) {
        vm.$query.size = pageSize
      }
    }

    function search(q) {
      vm.$query.q = q
    }

    const facets = computed(() => {
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

    return {
      collectionApi,
      currentComponent,
      facets,
      nextPage,
      prevPage,
      setPage,
      setPageSize,
      search
    }
  }
})
</script>
