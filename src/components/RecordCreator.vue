<template>
  <div>
    <h3>Record creator example</h3>
    This example can create a record with just the title, category and author
    <form @submit.prevent="save" style="margin-top: 20px" v-if="!created">
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
        <router-link to="/" tag="button" style="margin-left: 20px">Close</router-link>
      </div>
      <simple-error v-if="saveError" :error="saveError" title="Error saving data"/>
    </form>
    <div v-else>
      Created record
      <pre>{{ created }}</pre>
      <router-link to="/" tag="button" style="margin-left: 20px">Close</router-link>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'
import { SimpleErrorComponent } from '@oarepo/invenio-api-vue-composition'

export default defineComponent({
  name: 'record-creator',
  props: ['collectionApi'],
  components: {
    'simple-error': SimpleErrorComponent
  },
  setup(props) {
    const title = ref('')
    const author = ref('')
    const category = ref('')
    const created = ref(null)

    const saveError = ref(null)

    async function save() {
      saveError.value = null
      try {
        // patch the current record in json api
        created.value = await props.collectionApi.createRecord({
          title: title.value,
          category: category.value,
          author: {
            name: author.value
          }
        })
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
      save,
      saveError,
      created
    }
  }

})
</script>
