<template>
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-brand >
        <router-link to="/">PicPic Explorer</router-link>
      </b-navbar-brand>
    </b-navbar>
    <b-container class="view-wrapper">
    
      <router-view></router-view>  

    </b-container>
    <b-jumbotron fluid class="stats">
      <b-row>
        <b-col sm="4" md="2">
          <stat title="Articles total" 
            :value="articlesTotal"
            image="ios-copy.svg"></stat>
        </b-col>
        <b-col sm="4" md="2">
          <stat title="Articles w/ Getty IDs" 
            :value="articlesGettyID"
            image="md-photos.svg"></stat>
        </b-col>
        <b-col sm="4" md="2">
          <stat title="Articles w/ Getty lead" 
            :value="articlesGettyLead"
            image="getty.png"></stat>
        </b-col>
        <b-col sm="4" md="2">
          <stat title="Keywords total"
            :value="keywordsTotal"
            image="ios-link.svg"></stat>
        </b-col>
        <b-col sm="4" md="2">
          <stat title="Storage size" 
            :value="storageSize"
            image="ios-disc.svg"></stat>
        </b-col>
        <b-col sm="4" md="2">
          <stat title="Explorer version"
            :value="packageVersion"
            image="ios-build.svg"></stat>
        </b-col>
      </b-row>
    </b-jumbotron>

  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import prettyBytes from 'pretty-bytes'

import stat from './components/Stat.vue'

let apiRoot = `${API_ROOT}`
let version = `${VERSION}`

export default {
  name: 'app',
  data () {
    return {
      stats: {},
      packageVersion: version
    }
  },
  computed: {
    articlesTotal: function () {
      return this.stats.articlesTotal || '-'
    },
    articlesGettyID: function () {
      return this.stats.articlesGettyID || '-'
    },
    articlesGettyLead: function () {
      return this.stats.articlesGettyLead || '-'
    },
    keywordsTotal: function () {
      return this.stats.keywordsTotal || '-'
    },
    storageSize: function () {
      return this.stats.storageSize
        ? prettyBytes(this.stats.storageSize)
        : '-'
    },
    storageModified: function () {
      if (this.stats.storageModified) {
        let date = new Date(this.stats.storageModified)
        let string = date.toLocaleString('de-DE')
        return string
      }
      return '-'
    }
  },
  mounted () {
    this.$http.get(apiRoot + '/stats/').then(response => {
      this.stats = response.body
    }).catch(error => {})
  },
  components: { stat }
}
</script>

<style lang="scss">
.navbar .navbar-brand a {
  color: white;

  &:hover {
    text-decoration: none;
  }
}
.view-wrapper {
  margin-top: 20px;
}
.stats {
  margin-top: 30px;
  margin-bottom: 0;

  .card .card-body {
    font-size: 1rem;

    & .card-title {
      font-size: .7rem;
      margin-bottom: 0;
    }
  }
}
</style>
