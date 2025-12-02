import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './src/componentes/LandingPage.vue'
import GameView from './src/componentes/GameView.vue'
import RankingView from './src/componentes/RankingView.vue'

const routes = [
  { path: '/', name: 'Home', component: LandingPage },
  { path: '/game', name: 'Game', component: GameView },
  { path: '/ranking', name: 'Ranking', component: RankingView }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
