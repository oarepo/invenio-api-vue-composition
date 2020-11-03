<template>
  <div>
    <h3>Record editor example</h3>
    This example can edit just the title, category and author
    <form @submit.prevent="save" style="margin-top: 20px">
      <table>
        <tr>
          <td>
            <label>Title</label>
          </td>
          <td>
            <input v-model="title"/>
          </td>
        </tr>
        <tr>
          <td>
            <label>Author name</label>
          </td>
          <td>
            <input v-model="author"/>
          </td>
        </tr>
        <tr>
          <td>
            <label>Category</label>
          </td>
          <td>
            <select v-model="category">
              <option value="Article" :selected="category.value === 'Article'">Article</option>
              <option value="Book" :selected="category.value === 'Book'">Book</option>
              <option value="Research Data" :selected="category.value === 'Research Data'">Research Data</option>
            </select>
          </td>
        </tr>
      </table>
      <div style="margin-top: 20px">
        <input type="submit" value="Save">
        <button @click.prevent="cancel" style="margin-left: 20px">Cancel</button>
      </div>
      <simple-error v-if="saveError" :error="saveError" title="Error saving data"/>
    </form>
  </div>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'
import { SimpleErrorComponent } from '@oarepo/invenio-api-vue-composition'

export default defineComponent({
  name: 'record-editor',
  props: ['record', 'recordApi'],
  components: {
    'simple-error': SimpleErrorComponent
  },
  setup(props, ctx) {
    const record = props.record.metadata   // do not need reactivity here
    const title = ref(record.title)
    const author = ref(record.author.name)
    const category = ref(record.category)

    function cancel() {
      ctx.emit('done', false)
    }

    const saveError = ref(null)

    async function save() {
      saveError.value = null
      try {
        // patch the current record in json api
        await props.recordApi.patch([
          { op: 'replace', path: '/title', value: title.value },
          { op: 'replace', path: '/author/name', value: author.value },
          { op: 'replace', path: '/category', value: category.value }
        ], { storeResult: true })
        ctx.emit('done', true)
      } catch (e) {
        // normally would need a better way of displaying error :)
        console.error('Error in patch request', e)
        saveError.value = e
      }
    }

    return {
      title,
      author,
      category,
      cancel,
      save,
      saveError
    }
  }

})
</script>
