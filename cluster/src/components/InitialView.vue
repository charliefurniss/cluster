<template>
  <div class="mdl-layout mdl-js-layout">
    <header class="mdl-layout__header">
      <div class="mdl-layout-icon"></div>
      <div class="mdl-layout__header-row">
        <span class="mdl-layout__title">Cluster scans</span>
      </div>
    </header>
    <main class="content">
      <section class="search">
        <select class="select" v-model="searchOption" v-on:change="onSelectChange">
          <option value="1">Ones scan</option>
          <option value="3">Tens scan</option>
          <option value="0">Hundreds scan</option>
          <option value="5">Thousands scan</option>
          <option value="4">Tens of thousands scan</option>
          <option value="2">Full scan</option>
        </select>
        <label v-show="isSelectUnchanged">Please select a scan</label>
      </section>
      <section v-show="showFilter" class="filter">
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input class="mdl-textfield__input" type="text" id="filePathInput" v-model="filePathInput">
          <label class="mdl-textfield__label" for="filePathInput">Search on the filepath...</label>
        </div>
        <button v-on:change="onFilePathInput" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
          Button
        </button>
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
      data: [],
      isSelectUnchanged: true,
      searchOption: null,
      showFilter: false,
      filePathInput: ''
    }
  },
  methods: {
    onSelectChange: async function () {
      this.isSelectUnchanged = false;
      this.showFilter = true;
      this.data = await this.getData();
    },
    onFilePathInput: function () {
      this.updateData();
    },
    getData: function () {
      const resultsIndex = this.searchOption;
      const url = `http://c7webtest.azurewebsites.net/searches/${resultsIndex}/results?start=0&size=50`
      
      return fetch(url, {
        headers: {
          'content-type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(json => this.formatData(json))
    },
    updateData: function () {
      const filterValue = this.filePathInput;

      this.data = this.filterData(filterValue);
    },
    filterData: function (filterValue) {
      return this.data.filter(item => {
        return item.Path.indexOf(filterValue) !== -1;
      })
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

<style lang="scss" scoped>
.search, .filter {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 64px;
  position: relative;
}
.search {
  .select {
    outline: none;
    height: 32px;
    background-color: #fff;
    border-radius: 4px;
    width: 200px;
    padding: 24px;
  }
  label {
    position: absolute;
    left: 10px;
    font-size: 12px;
  }
}
.filter {
  button {
    margin-left: 32px;
  }
}
.results {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  overflow-y: auto;
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
