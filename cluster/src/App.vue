<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  height: 100%;
  header {
    &.mdl-layout__header {
      @media screen and (max-width: 1024px) {
        display: flex;
      }
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1 1 auto;
  }
}
</style>
