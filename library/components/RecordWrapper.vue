<template>
  <component
    :is="currentComponent"
    :record-api="recordApi"
    :record="recordApi.record.value"
    :loading="recordApi.loading.value"
    :loaded="recordApi.loaded.value"
    :error="recordApi.error.value"
    :stale="recordApi.stale.value"
    :reload="recordApi.reload"
    @reload="recordApi.reload"
  ></component>
</template>

<script>
import { computed, defineComponent, getCurrentInstance } from '@vue/composition-api'
import { useInvenioRecord } from '..'
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
  setup(props) {
    const vm = getCurrentInstance()
    const recordId = computed(() => vm.$route.params.recordId)

    const recordApi = useInvenioRecord(props.apiUrl, props.httpGetProps, props.httpOptionsProps)

    function reload() {
      recordApi.load(recordId.value, props.collectionCode, true)
    }
    reload()

    const currentComponent = selectComponent (
      () => recordApi.record.value,
      () => recordApi.error.value,
      props)

    return {
      record: recordApi.record,
      recordApi,
      reload,
      recordId,
      currentComponent
    }
  },
  computed: {
    routeParams: function () {
      return this.$route.params
    }
  },
  watch: {
    routeParams: function() {
      this.reload()
    }
  }
})
</script>
