<template>
    <component
            :is="viewerComponent"
            :collection-api="collectionApi"
            :records="collectionApi.records.value"
            :facets="facets"
            :loading="collectionApi.loading.value"
            :loaded="collectionApi.loaded.value"
            :error="collectionApi.error.value"
            :stale="collectionApi.stale.value"
            :pages="collectionApi.pages.value"
            :reload="collectionApi.reload"
            @reload="collectionApi.reload"
            v-bind="propsAndAttributes"
    ></component>
</template>
<script>
import { computed, defineComponent, getCurrentInstance, watch } from '@vue/composition-api'
import { useInvenioCollection } from '../invenio/collection'
import { useFacetModels } from './facets'


export default defineComponent({
  name: 'invenio-collection-api-wrapper',
  props: {
    collectionCode: {
      required: true,
      type: String
    },
    viewerComponent: {
      required: true,
      type: [Object, Function]
    },
    apiUrl: {
      type: String,
      default: '/api'
    },
    recordRouteName: {
      type: [Function, String]
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
          name: typeof props.recordRouteName === 'function' ? props.recordRouteName(record) : props.recordRouteName,
          params: {
            recordId: record.id
          }
        }
      },
      ...(props.httpGetProps || [])
    }
    const collectionApi = useInvenioCollection(props.apiUrl, getProps, props.httpOptionsProps)

    function reload() {
        collectionApi.setCollectionCode(props.collectionCode)
    }
    watch(computed(() => vm.$query.__self.incr), () => {
      reload()
    })
    reload()

    const facets = useFacetModels(collectionApi, vm)

    const propsAndAttributes = computed(() => ({
      ...props,
      ...ctx.attrs
    }))

    return {
      reload,
      collectionApi,
      facets,
      propsAndAttributes
    }
  }
})
</script>
