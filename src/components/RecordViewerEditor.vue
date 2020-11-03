<template>
  <div class="twocolumn record">
    <div>
      <router-view v-bind="props" @done="done"></router-view>
    </div>
    <div v-if="!editing">
      <router-link :to="{name:'record-editor', params: {recordId}}" tag="button">Edit Record</router-link>
      <button @click="removeRecord">Remove Record</button>
    </div>
  </div>
</template>
<script>
import { computed } from '@vue/composition-api'

export default {
  name: 'record-viewer-editor',
  props: ['recordId', 'record', 'recordApi', 'error'],
  setup(props, ctx) {
    function done() {
      ctx.root.$router.push({ name: 'record-viewer', params: { recordId: ctx.root.$route.params.recordId } })
    }

    const routeName = computed(() => ctx.root.$route.name)
    const editing = computed(() => routeName.value === 'record-editor')

    async function removeRecord() {
      if (window.confirm('Do you really want to delete the record?')) {
        try {
          await props.recordApi.remove()
          ctx.root.$router.push({ name: 'record-list' })
        } catch (e) {
          // there should be a better handling here
          console.error('Error during deleting the record', e)
          alert(e.toString())
        }
      }
    }

    return {
      editing,
      props,
      done,
      removeRecord
    }
  }
}
</script>
<style>

</style>
