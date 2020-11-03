<template>
  <div>
    <h3>
      <span class="document-type">{{ md.category }}</span>
      {{ md.title }}
    </h3>
    <div>
      {{ author.name }}
    </div>
    <div>
      {{ author.company }}
    </div>
    <table>
      <tr>
        <td colspan="2">
          <h4>
            Document metadata
          </h4>
        </td>
      </tr>
      <tr>
        <td>
          Created
        </td>
        <td>
          {{ $d(new Date(record.created), 'short') }}
        </td>
      </tr>
      <tr>
        <td>
          Updated
        </td>
        <td>
          {{ $d(new Date(record.updated), 'short') }}
        </td>
      </tr>
      <tr>
        <td>
          Control number
        </td>
        <td>
          {{ md.control_number }}
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <h4>
            Author's Occupation
          </h4>
        </td>
      </tr>
      <tr>
        <td>
          Company
        </td>
        <td>
          {{ author.company }}
        </td>
      </tr>
      <tr>
        <td>
          Company address
        </td>
        <td>
          {{ author.address }}
        </td>
      </tr>
      <tr>
        <td>
          Position
        </td>
        <td>
          {{ author.job }}
        </td>
      </tr>
      <tr>
        <td>
          Email
        </td>
        <td>
          {{ author.mail }}
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <h4>
            Author's Personal Data
          </h4>
        </td>
      </tr>
      <tr>
        <td>
          First and last name
        </td>
        <td>
          {{ author.name }}
        </td>
      </tr>
      <tr>
        <td>
          Birthdate
        </td>
        <td>
          {{ $d(new Date(author.birthdate), 'short') }}
        </td>
      </tr>
      <tr>
        <td>
          Sex
        </td>
        <td>
          {{ author.sex }}
        </td>
      </tr>
      <tr>
        <td>
          SSN
        </td>
        <td>
          {{ author.ssn }}
        </td>
      </tr>
      <tr>
        <td>
          Home address
        </td>
        <td>
          {{ author.residence }}
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <h4>
            Extra routing properties
          </h4>
        </td>
      </tr>
      <tr>
        <td>
          Extra property from the route props
        </td>
        <td>
          {{ extraProperty }}
        </td>
      </tr>
    </table>
  </div>
</template>
<script>

export default {
  name: 'record-viewer',
  props: [
    'record',
    'extraProperty'
  ],
  data: function () {
    return {}
  },
  computed: {
    md: function () {
      return this.record.metadata
    },
    author: function () {
      return this.md.author
    }
  }
}
</script>
<style>

</style>
