<template>
  <div class="content">
    <div v-for="data in data" v-bind:key="data.id">
      <p>{{data.Name}}</p>
    </div>
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
  },
  methods: {
    getData: function () {
      return fetch('http://c7webtest.azurewebsites.net/searches', {
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
<style scoped>
h1, h2 {
  font-weight: normal;
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
