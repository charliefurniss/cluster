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
            <span class="result__item-value">{{data.LastUsed}}</span>
          </div>
          <div class="result__item">
            <span class="result__item-label">Extension</span>
            <span class="result__item-value">{{data.Extension}}</span>
          </div>
        </div>
      </section>
      
    </main>
  </div>
</template>

<script>
import moment from 'moment';

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
      return fetch('http://c7webtest.azurewebsites.net/searches/0/results?start=0&size=5', {
        headers: {
          'content-type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(json => this.formatData(json))
    },
    formatData: function (data) {
      const dataItems = [...data];
      return dataItems.map(item => {
        const Path = this.formatPath(item.Path);
        const Size = this.formatSize(item.Size);
        const Extension = this.getExtension(item.Path);
        const LastUsed = this.setLastUsed(item);
        return {
          Path,
          Size,
          Extension,
          LastUsed
        }
      })
    },
    formatPath: function (path) {
      const pathWithoutExtension = path.substring(0, path.indexOf('.'));

      return this.correctPathSlashes(pathWithoutExtension);
    },
    correctPathSlashes: function (string) {
      const stringWithFirstTwoCharactersRemoved = string.substr(2);
      
      return stringWithFirstTwoCharactersRemoved.replace(/\\/g,'/');
    },
    formatSize: function (size) {
      const megaBytes = size / 1000000;
      const roundedSize = Math.round(megaBytes * 10) / 10;
      return `${roundedSize}MB`;
    },
    getExtension: function (path) {
      return path.split('.').pop().toLowerCase();
    },
    setLastUsed: function (item) {
      return (item.Created > item.LastModified) ? this.formatDate(item.Created) : this.formatDate(item.LastModified);
    },
    formatDate: function (unformattedDate) {
      return moment(unformattedDate).format('D MMM YYYY, h:mma');
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
  padding: 0 16px 0 56px;
  @media screen and (min-width: 1025px) {
    padding: 0 24px 0 64px;
  }
  .result {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    flex-shrink: 0;
    padding-top: 16px;
    text-align: left;
    &__item {
      margin-bottom: 8px;
      span {
        display: block;
      }
      &-label {
        font-size: 12px;
      }
      &-value {
        font-weight: 500;
      }
    }
  }
}
</style>
