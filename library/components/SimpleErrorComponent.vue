<template>
  <div class="invenio-error-loading-page">
    <h3>Error loading data</h3>
    <div v-if="error.type === 'unknown'">
      <h4>Unknown error</h4>
      <pre>
        {{ error.raw }}
      </pre>
    </div>
    <div v-else-if="error.type === 'responseMissing'">
      <h4>No response from server</h4>
      The request has not been delivered to the server due to network error
      or the server has not responded in time.
    </div>
    <div v-else-if="error.type === 'unauthorized'">
      <h4>Unauthorized</h4>
      The server says you have no rights to access the resource
    </div>
    <div v-else-if="error.type === 'clientError'">
      <h4>The client send invalid data</h4>
      The client has sent invalid data. Details:
      <div v-html="error.reason" v-if="hasHtmlError"></div>
      <pre v-else>{{ error.reason }}</pre>
    </div>
    <div v-else-if="error.type === 'serverError'">
      <h4>Server error</h4>
      The server experienced error during handling your request.
      <div v-html="error.reason" v-if="hasHtmlError"></div>
      <pre v-else>{{ error.reason }}</pre>
    </div>
    <button class="reload" @click.prevent="reload" v-if="reload">Reload</button>
  </div>
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    reload: {
      type: Function
    },
    error: {
      type: Object
    }
  },
  setup(props) {
    const hasHtmlError = computed(() => {
      return props.error && props.error.reason && (typeof props.error.reason === 'string')
    })
    return { error: props.error, reload: props.reload, hasHtmlError }
  }
})
</script>
