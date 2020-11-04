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
            v-bind="propsAndAttributes"
    ></component>
</template>
<script>
import { computed, defineComponent, getCurrentInstance, watch } from '@vue/composition-api'
import { useInvenioCollection } from '../invenio/collection'
import {selectComponent} from './componentSelector'
import { useFacetModels } from './facets'

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
  setup(props, ctx) {
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
      // console.log('query changed, loading ...', vm.$query.__self.incr, JSON.stringify(vm.$query))
      reload()
    })
    watch(props, reload)

    const thisRouteName = vm.$route.name
    const isThisRoute = computed(() => vm.$route.name === thisRouteName)
    watch(isThisRoute, () => {
      if (isThisRoute.value) {
        reload()
      }
    })

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


    const facets = useFacetModels(collectionApi, vm)

    const propsAndAttributes = computed(() => ({
      ...props,
      ...ctx.attrs
    }))

    return {
      collectionApi,
      currentComponent,
      facets,
      nextPage,
      prevPage,
      setPage,
      setPageSize,
      search,
      propsAndAttributes
    }
  }
})
</script>
