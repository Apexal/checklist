<template lang="pug">
#home
  section
    h3 What is this?
    p This is a simple site that allows you to create a custom college move in checklist, use it to track packing, and share your own list or view and user others'! You can create a list and save it to be view later on; you can also edit an existing list somebody else has made and save it as your own.
    p Click the #[b Create List] button below to start building your own checklist, or check out an #[router-link(:to="`/checklist/-LK28uMo_9TQV3koi7rF`") example list] (the one I'll be using myself!).
    
    p I'm starting Freshman year at RPI this September, which has inspired me to make this!
    img.rpi-logo(src="../assets/RPILogo.jpg")
    
    h3 What is it made with?
    p This site is a VueJS Single Page Application (SPA) using Firebase's free tier for its database and hosting. It's my first real attempt at a SPA with VueJS in a while.

  router-link(v-show="has_current", :to="{path: `/checklist/${current_key}`}")
    button.big.warning Your List
  router-link(to="/checklist/create")
    button.big Create List
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
      has_current: false,
      current_key: localStorage.getItem('checklist-key')
    };
  },
  created () {
    this.has_current = this.current_key !== null;
  },
  computed: {
    hasCurrent () {
      return localStorage.getItem('checklist-key') !== null;
    },
    currentKey() {
      return localStorage.getItem('checklist-key');
    }
  }
}
</script>

<style scoped>
.rpi-logo {
  max-width: 150px;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

button.big {
  font-size: 1.5em;
  padding: 10px 25px;
}
</style>
