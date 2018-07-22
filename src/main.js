import Vue from 'vue'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'

import ListView from './views/List.vue'
import DetailView from './views/Detail.vue'

Vue.use(VueRouter)
Vue.use(BootstrapVue)

const routes = [
  { path: '/', component: ListView },
  { path: '/article/:id', component: DetailView, props: true }
]

const router = new VueRouter({routes})

new Vue({
  el: '#app',
  render: h => h(App),
  router: router
})
