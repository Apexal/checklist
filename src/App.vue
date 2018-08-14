<template lang="pug">
  #app
    img#rpi-logo(alt="RPI logo", src="./assets/RPILogo.jpg")
    HelloWorld(msg="Welcome to VueJS")
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  #rpi-logo {
    max-width: 200px;
  }
}
</style>
