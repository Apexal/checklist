<template lang="pug">
#checklist
  h1 View Checklist

  router-link(:to="{ path: '/checklist/create', query: { list: encoded } }") Edit
</template>

<script>
import Vue from 'vue';

export default {
  name: 'checklist',
  data () {
    return {
      categories: {}
    }; 
  },
  created () {
    if (this.$route.query.list) {
      const decoded = JSON.parse(decodeURI(this.$route.query.list));
      for(const category_name in decoded) {
        Vue.set(this.categories, category_name, decoded[category_name]);
      }
      
    }
  },
  computed: {
    encoded () { return JSON.stringify(this.categories); }
  }
}
</script>

<style scoped lang="scss">
</style>
