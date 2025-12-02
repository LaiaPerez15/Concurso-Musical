import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../componentes/LandingPage.vue'
import GameView from '../componentes/GameView.vue'
import RankingView from '../componentes/RankingView.vue'

const routes = [
  { path: '/', name: 'Home', component: LandingPage },
  { path: '/game', name: 'Game', component: GameView },
  { path: '/ranking', name: 'Ranking', component: RankingView }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
