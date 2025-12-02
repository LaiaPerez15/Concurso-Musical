import { createRouter, createWebHistory } from 'vue-router'
import HomeVue from '../views/HomeVue.vue' // o HomeView, lo que uses
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/',
    name: 'home',
    component: HomeVue// o HomeView, lo que uses
  }
  ],
})

export default router
