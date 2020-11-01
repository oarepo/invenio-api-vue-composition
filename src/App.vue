<template>
  <div id="app">
    <div class="page">
      <div id="nav">
        <router-link to="/">Record collection</router-link>
        <router-link to="/1">First record</router-link>
        <router-link to="/2">Second record</router-link>
        <router-link to="/3">Third record</router-link>
        <div class="fill-space"></div>
        <a href="https://github.com/oarepo/invenio-api-vue-composition">Github</a>
      </div>
      <router-view/>
    </div>
  </div>
</template>
<script>
export default {
}
</script>
<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 0;
  padding: 0;
}

#nav {
  margin-bottom: 30px;
  border-bottom: 1px solid #42b983;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  a {
    font-weight: bold;
    color: #2c3e50;
    padding: 10px;
    text-decoration: none;

    &.router-link-exact-active {
      background-color: #42b983;
    }
  }

  .fill-space {
    flex-grow: 1
  }
}

.page {
  max-width: 1000px;
  width: 100%;
}

.twocolumn {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  .left {
    width: 66%;
    display: flex;
    flex-direction: column;
  }

  .right {
    width: 33%;
    display: flex;
    flex-direction: column;
    & > * {
      margin-bottom: 10px;
      width: 100%;
    }
  }
}

.row {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  width: 100%;

  & > *:not(:last-child) {
    margin-right: 10px;
  }
}

.items-stretch {
  align-items: stretch;
}

.record-list {
  display: flex;
  flex-direction: column;
  justify-items: stretch;

  .record-list-record {
    padding: 10px;
    margin-bottom: 20px;
  }

  h3 {
    color: #42b983;
  }
}

.facet {
  padding-left: 20px;
  width: calc(100% - 20px);
  justify-content: space-between;
  align-items: start;

  input {
    margin-right: 10px;
  }
}

</style>
