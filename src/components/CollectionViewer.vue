<template>
  <div class="twocolumn">
    <div class="left record-list">
      <div v-for="record in records" :key="record.id" class="record-list-record">
        <h3>{{ record.metadata.title }}</h3>
        <div>{{ record.metadata.category }} by {{ record.metadata.author.name }}</div>
        <table style="padding-top: 10px" cellspacing="0" cellpadding="0">
          <tr>
            <td>Published</td>
            <td style="padding-left: 20px">{{ $d(new Date(record.created), 'short') }}</td>
          </tr>
          <tr>
            <td>Last updated</td>
            <td style="padding-left: 20px">{{ $d(new Date(record.updated), 'short') }}</td>
          </tr>
        </table>
      </div>
      <div class="row">
        <button v-if="page > 1" @click="$emit('prevPage')">prev page</button>
        <span><input :value="page" @change="$emit('setPage', $event.target.value)"> of {{ pages }}</span>
        <button v-if="page < pages" @click="$emit('nextPage')">next page</button>
      </div>
    </div>
    <div class="right">
      <div class="row items-stretch">
        <input name="search" v-model="search" placeholder="Search ..." style="flex-grow: 1;">
        <button @click.prevent="doSearch"><i class="fas fa-search"></i></button>
      </div>
      <facet v-for="facet in facets" :key="facet.code" :facet="facet"></facet>
      <div style="height: 300px"></div>
      <b>Debugging info:</b>
      <table>
        <tr>
          <td>Loading</td>
          <td>{{ loading }}</td>
        </tr>
        <tr>
          <td>Loaded</td>
          <td>{{ loaded }}</td>
        </tr>
        <tr>
          <td>Stale</td>
          <td>{{ stale }}</td>
        </tr>
        <tr>
          <td colspan="2" align="center">
            <button @click="reload">Reload records</button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import Facet from './Facet.vue'
export default {
  props: [
    'collectionApi', 'records', 'facets', 'loading', 'loaded', 'error', 'stale', 'reload', 'pages', 'page',
    'query'
  ],
  components: {
      Facet
  },
  data: function() {
    return {
      search: ''
    }
  },
  mounted() {
    this.search = this.query
  },
  methods: {
    doSearch() {
      this.$emit('search', this.search)
    }
  }
}
</script>
<style>

</style>
