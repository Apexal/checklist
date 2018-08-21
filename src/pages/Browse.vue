<template lang="pug">
  #browse
    h1 Browse Lists
      small  {{ checklists.length }} total

    .checklists
      div(v-for="(list, key) in checklists")
        h3 {{ getCategoryTitles(list).join(', ') }}
        router-link(:to="{ path: `/checklist/${list['.key']}` }")
          button Browse
        hr
</template>

<script>
import db from '../firebase.js';

export default {
  name: 'Browse',
  firebase: {
    checklists: {
      source: db.ref('/lists'),
      readyCallback () {
        // eslint-disable-next-line
        console.log('Loaded lists from Firebase...');
      }
    }
  },
  methods: {
    getCategoryTitles (list) {
      return Object.keys(list).filter(key => key !== '.key');
    }
  }
}
</script>

<style scoped lang="scss">
</style>
