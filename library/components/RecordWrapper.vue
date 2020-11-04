<template>
  <component
    :is="currentComponent"
    :record-api="recordApi"
    :record-id="recordId"
    :record="record"
    :loading="loading"
    :loaded="loaded"
    :error="error"
    :stale="stale"
    :reload="recordApi.reload"
    @reload="recordApi.reload"
    v-bind="propsAndAttributes"
  ></component>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, watch } from '@vue/composition-api'
import { useInvenioRecord } from '../invenio/record'
import { selectComponent } from './componentSelector'

export default defineComponent({
  name: 'invenio-record-wrapper',
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
    httpOptionsProps: {
      type: Object
    },
    httpGetProps: {
      type: Object
    }
  },
  setup(props, ctx) {
    const vm = getCurrentInstance()
    const recordId = computed(() => vm.$route.params.recordId)

    const recordApi = useInvenioRecord(props.apiUrl, props.httpGetProps, props.httpOptionsProps)

    function reload() {
      recordApi.load(recordId.value, props.collectionCode, true)
    }

    watch(recordId, () => {
      if (recordId.value) {
        reload()
      }
    })
    reload()

    const currentComponent = selectComponent(
      () => recordApi.record.value,
      () => recordApi.error.value,
      props)

    const propsAndAttributes = computed(() => ({
      ...props,
      ...ctx.attrs
    }))

    return {
      record: recordApi.record,
      recordApi,
      reload,
      recordId,
      currentComponent,
      propsAndAttributes,
      loading: recordApi.loading,
      loaded: recordApi.loaded,
      error: recordApi.error,
      stale: recordApi.stale
    }
  }
})
</script>
