<template lang="pug">
  #app
    header
      h1 College Move In Checklist Creator
    main
      router-view
    footer
      p Created by #[a(href="https://github.com/Apexal", target="_blank") Frank Matranga '22] under the #[b MIT License]
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

#app {
  // From Vue
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  margin-top: 0;
  padding: 0;

  header {
    background-color: rgb(243, 243, 243);

    h1 {
      margin: 0;
      padding: 40px;
      font-size: 2.5em;
    }
  }

  footer {
    padding-top: 30px;
    background-color: rgb(243, 243, 243);
    padding-bottom: 30px;
  }
}
</style>
