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
        <div class="search-area select-area">
          <select class="select-area__select" v-model="searchOption" v-on:change="onSelectChange">
            <option value="1">Ones scan</option>
            <option value="3">Tens scan</option>
            <option value="0">Hundreds scan</option>
            <option value="5">Thousands scan</option>
            <option value="4">Tens of thousands scan</option>
          </select>
          <label class="select-area__label" v-show="!isSelectActive">Please select a scan</label>
        </div>
        <div class="search-area textfield-area">
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" id="filePathInput" v-model="filePathInput">
            <label class="mdl-textfield__label" for="filePathInput">Enter file path...</label>
          </div>
          <button v-on:click="displaySearchResults" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
            Search
          </button>
        </div>
      </section>
      <section v-show="showLoader" class="loader">
        <div class="loader__loader"></div>
      </section>
      <section v-show="showResults" class="results">
        <div class="results__tally">
          <h6>Total results: {{totalResults}}</h6>
        </div>
        <div class="result" v-for="data in data" v-bind:key="data.id">
          <div class="result__item">
            <span class="result__item-label">File path</span>
            <span class="result__item-value">{{data.path}}</span>
          </div>
          <div class="result__item">
            <span class="result__item-label">Size</span>
            <span class="result__item-value">{{data.size}}</span>
          </div>
          <div class="result__item">
            <span class="result__item-label">Last used date</span>
            <span class="result__item-value">{{data.lastUsed}}</span>
          </div>
          <div class="result__item">
            <span class="result__item-label">Extension</span>
            <span class="result__item-value">{{data.extension}}</span>
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
      isSelectActive: false,
      searchOption: null,
      showFilter: false,
      filePathInput: '',
      showResults: false,
      showLoader: false
    }
  },
  computed: {
    totalResults: function ()  {
      return this.data.length;
    },
  },
  methods: {
    onSelectChange: function () {
      this.isSelectActive = true;
      this.displaySearchResults();
    },
    displaySearchResults: async function () {
      this.showResults = false;
      this.showLoader = true;
      this.data = await this.searchData();
      this.showLoader = false;
      this.showResults = true;
    },
    searchData: async function () {
      const data = await this.getData();
      const searchString = this.filePathInput.toLowerCase();

      return this.filePathInput ? this.filterData(searchString, data) : data;
    },
    getData: function () {
      const FULL_SCAN_INDEX = 2;
      const resultsIndex = this.searchOption || FULL_SCAN_INDEX;
      const url = `http://c7webtest.azurewebsites.net/searches/${resultsIndex}/results?start=0&size=10000`
      
      return fetch(url, {
        headers: {
          'content-type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(json => this.formatData(json))
    },
    filterData: function (filterValue, fullScanData) {
      return fullScanData.filter(item => {
        return item.Path.indexOf(filterValue) !== -1;
      })
    },
    formatData: function (data) {
      const dataItems = [...data];

      return dataItems.map(item => {
        return this.formatItem(item);
      })
    },
    formatItem: function (item) {
      const path = this.formatPath(item.Path);
      const size = this.formatSize(item.Size);
      const extension = this.getExtension(item.Path);
      const lastUsed = this.setLastUsed(item);
      
      return { path, size, extension, lastUsed };
    },
    formatPath: function (path) {
      const pathWithoutExtension = path.substring(0, path.indexOf('.'));
      const pathWithFormattedSlashes = this.formatPathSlashes(pathWithoutExtension);

      return pathWithFormattedSlashes.toLowerCase();
    },
    formatPathSlashes: function (string) {
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
.search-area {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 64px;
  position: relative;
  button {
    margin-left: 32px;
  }
}
.select-area {
  &__select {
    outline: none;
    height: 32px;
    background-color: #fff;
    border-radius: 4px;
    width: 200px;
    padding: 24px;
  }
  &__label {
    position: absolute;
    left: 10px;
    font-size: 12px;
  }
}
.loader {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1 0 auto;
  &__loader {
    box-sizing: border-box;
    border-radius: 100%;
    width: 50px;
    height: 50px;
    border: 4px solid rgba(63, 81, 181, 0.2);
    border-top-color: rgb(63, 81, 181);
    border-right-color: rgb(63, 81, 181);
    animation: spin 1s infinite linear;
  }
}
.results {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  overflow-y: auto;
  &__tally {
    font-weight: 500;
    h6 {
      color: rgb(63,81,181);
    }
  }
  .result {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    flex-shrink: 0;
    padding-top: 16px;
    text-align: left;
    border-bottom: 1px solid rgba(0,0,0,0.12);
    &__item {
      margin-bottom: 8px;
      span {
        display: block;
      }
      &-label {
        font-size: 12px;
        color: rgb(63,81,181);
      }
      &-value {
        font-weight: 500;
      }
    }
  }
}

@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

</style>
