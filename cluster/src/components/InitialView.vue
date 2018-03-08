<template>
  <div class="mdl-layout mdl-js-layout">
    <header class="mdl-layout__header">
      <div class="mdl-layout-icon"></div>
      <div class="mdl-layout__header-row">
        <span class="mdl-layout__title">Cluster search</span>
      </div>
    </header>
    <main class="content">
      <section class="search">
        
      </section>
      <section class="results">
        <div class="result" v-for="data in data" v-bind:key="data.id">
          <div class="result__item">
            <span class="result__item-label">File path</span>
            <span class="result__item-value">{{data.Path}}</span>
          </div>
          <div class="result__item">
            <span class="result__item-label">Size</span>
            <span class="result__item-value">{{data.Size}}</span>
          </div>
          <div class="result__item">
            <span class="result__item-label">Last used date</span>
            <span class="result__item-value">{{data.LastModified}}</span>
          </div>
        </div>
      </section>
      
    </main>
  </div>
</template>

<script>
export default {
  name: 'InitialView',
  data () {
    return {
      data: []
    }
  },
  created: async function () {
    this.data = await this.getData()
    console.log(this.data);
  },
  methods: {
    getData: function () {
      return fetch('http://c7webtest.azurewebsites.net/searches/0/results?start=0&size=5', {
        headers: {
          'content-type': 'application/json'
        }
      })
      .then(res => res.json())
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.results {
  display: flex;
  flex-direction: column;
  align-items: center;
  .result {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding: 16px;
    text-align: left;
    width: 70%;
    &__item {
      margin-bottom: 8px;
      span {
        display: block;
      }
      &-label {

      }
      &-value {

      }
    }
  }
}
</style>
