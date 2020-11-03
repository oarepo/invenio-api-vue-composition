<template>
  <div class="twocolumn">
    <div class="left record-list">
      <div v-for="record in records" :key="record.id" class="record-list-record">
        <h3>
          <router-link :to="record.links.ui">{{ record.metadata.title }}</router-link>
        </h3>
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
      <div class="twocolumn">
        <div class="row">
          <button v-if="page > 1" @click="$emit('prevPage')"><i class="fas fa-caret-left"></i></button>
          <span><input :value="page" @change="$emit('setPage', $event.target.value)" style="width: 50px"> of {{
              pages
            }}</span>
          <button v-if="page < pages" @click="$emit('nextPage')"><i class="fas fa-caret-right"></i></button>
        </div>

        <select :value="pageSize" @change="$emit('setPageSize', $event.target.value)">
          <option value="3" :selected="pageSize === 3">3 records per page</option>
          <option value="10" :selected="pageSize === 10">10 records per page</option>
          <option value="20" :selected="pageSize === 20">20 records per page</option>
          <option value="50" :selected="pageSize === 50">50 records per page</option>
        </select>
      </div>
    </div>
    <div class="right">
      <div class="row items-stretch">
        <input name="search" v-model="search" placeholder="Search ..." style="flex-grow: 1;">
        <button @click.prevent="doSearch"><i class="fas fa-search"></i></button>
      </div>
      <div class="facets-list">
        <facet v-for="facet in facets" :key="facet.code" :facet="facet"></facet>
      </div>
      <router-link :to="{name: 'record-creator'}" tag="button">Create a new record</router-link>
      <div class="debug-info">
        <b>Internals:</b>
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
  </div>
</template>
<script>
import Facet from './Facet.vue'

export default {
  props: [
    'collectionApi', 'records', 'facets', 'loading', 'loaded', 'error', 'stale', 'reload', 'pages', 'page',
    'query', 'pageSize'
  ],
  components: {
    Facet
  },
  data: function () {
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
