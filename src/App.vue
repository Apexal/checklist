<template lang="pug">
  #app
    header
      h1 College Move In Checklist 📑
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

main {
  margin: 0 auto;
  max-width: 800px;
}

input[type='text'],
input[type='number'] {
  border: none;
  background-image: none;
  background-color: transparent;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;

  border: 1px solid #2c3e50;
  padding: 5px;
  background-color: white;
  border-radius: 5px;
}

input[type='number'] {
  max-width: 30px;
}

button {
  padding: 5px 15px;
  font-size: 0.9em;
  border: none;
  background-color: #2c3e50;
  border-radius: 5px;
  text-transform: uppercase;
  font-weight: 600;
  color: #f3f3f3;
  margin: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #1d2835;
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
