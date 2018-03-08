import Vue from 'vue'
import Router from 'vue-router'
import InitialView from '@/components/InitialView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'InitialView',
      component: InitialView
    }
  ]
})
