<template lang="pug">
  #home
    h1 Home

    section
      h3 What is this?
      p This is a simple site that allows you to create a custom college move in checklist, use it to track packing, and share your own list or view and user others'!
      p #[img.rpi-logo(src="../assets/RPILogo.jpg")]
      h3 What is it made with?
      p This site is a VueJS Single Page Application (SPA) using no backend for storage, because sharing a list is entirely stored in the url.

    router-link(to="/checklist/create")
      button Create
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.rpi-logo {
  max-width: 200px;
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
</style>
