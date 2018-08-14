<template lang="pug">
  h3 {{ name }}
</template>

<script>
export default {
  name: 'category',
  props: {
    name: String,
    count: Number
  },
  data () {
    return {
      items: []
    };
  }
}
</script>

<style lang="scss">
</style>
