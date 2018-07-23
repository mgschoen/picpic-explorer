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

  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
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
</style>
