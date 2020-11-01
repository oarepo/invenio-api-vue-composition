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
    </div>
    <div class="right">
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
      <pre>{{ facets }}</pre>
    </div>
  </div>
</template>
<script>

export default {
  props: [
    'collectionApi', 'records', 'facets', 'loading', 'loaded', 'error', 'stale', 'reload'
  ],
}
</script>
<style>

</style>
