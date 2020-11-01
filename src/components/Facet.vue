<template>
  <div>
    <div @click="facet.enabled = !facet.enabled" style="cursor: pointer">
      <i :class="titleClass"></i>
      {{ facet.facet.label }}
    </div>
    <div v-if="facet.enabled">
      <div class="row facet" v-for="bucket in facet.buckets" :key="bucket.key">
        <div>
          <input type="checkbox" v-model="facet.model" :value="bucket.key">
          <span>{{ bucket.key_as_string || bucket.key }}</span>
        </div>
        <span>{{ bucket.doc_count }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['facet'],
  computed: {
    titleClass() {
      if (this.facet.enabled) {
        return 'fas fa-caret-down'
      } else {
        return 'fas fa-caret-right'
      }
    }
  }
}
</script>
