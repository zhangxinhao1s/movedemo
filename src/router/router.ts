import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../view/home.vue'
// import AboutView from './AboutView.vue'

const routes = [
  { path: '/', component: HomeView },
//   { path: '/about', component: AboutView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router 