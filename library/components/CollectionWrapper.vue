<template>
    <component
            :is="currentComponent"
            :collection-api="collectionApi"
            :records="collectionApi.records.value"
            :facets="collectionApi.facets.value"
            :loading="collectionApi.loading.value"
            :loaded="collectionApi.loaded.value"
            :error="collectionApi.error.value"
            :stale="collectionApi.stale.value"
            :reload="collectionApi.reload"
    ></component>
</template>
<script>
import { computed, defineComponent, watch } from '@vue/composition-api'
import { useInvenioCollection } from '..'
import SimpleErrorComponent from './SimpleErrorComponent.vue'
import EmptyLoadingComponent from './EmptyLoadingComponent.vue'

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
      collectionApi.load(props.collectionCode, {}, true)
    }

    watch(props, reload)
    reload()

    const currentComponent = computed(() => {
      if (collectionApi.records.value && collectionApi.records.value.length) {
        return props.viewerComponent
      } else if (collectionApi.error.value) {
        if (props.errorComponent === 'viewer') {
          return props.viewerComponent
        } else if (props.errorComponent === 'simple' || !props.errorComponent) {
          return SimpleErrorComponent
        } else {
          return props.errorComponent
        }
      } else {
        if (props.loadingComponent === 'viewer') {
          return props.viewerComponent
        } else if (props.loadingComponent === 'simple' || !props.loadingComponent) {
          return EmptyLoadingComponent
        } else {
          return props.loadingComponent
        }
      }
    })

    return {
      collectionApi,
      currentComponent
    }
  }
})
</script>
