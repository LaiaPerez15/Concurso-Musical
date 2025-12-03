<template>
  <div class="ranking-container">
    <h2>RANKING TOP 10</h2>

    <div v-if="!store.rankings.length" class="empty-ranking">
      <p>Aún no hay puntuaciones. ¡Juega para aparecer aquí!</p>
    </div>

    <!-- Contenedor centrado -->
    <div v-else class="centered-container">
      <div class="cards-wrapper">
        <div 
          v-for="(r, i) in store.rankings" 
          :key="i" 
          class="ranking-card"
          :class="{ current: isLast(r), 'top-card': i < 3 }"
        >
          <span class="position">
            <span v-if="i === 0">🥇</span>
            <span v-else-if="i === 1">🥈</span>
            <span v-else-if="i === 2">🥉</span>
            <span v-else>{{ i + 1 }}</span>
          </span>
          
          <span class="name">{{ r.name }}</span>
          <span class="score">{{ r.score }} pts</span>
          <span class="accuracy">{{ r.accuracy }}%</span>
          <span class="time">{{ r.time }}s</span>
        </div>
      </div>
    </div>

    <div class="actions">
      <button @click="goToHome" class="btn-home">VOLVER AL INICIO</button>
      <button @click="clearRanking" class="btn-clear">BORRAR RANKING</button>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/game.js'
import { useRouter } from 'vue-router'

const store = useGameStore()
const router = useRouter()

function isLast(r) {
  const e = store.lastEntry
  return e && r.name === e.name && r.date === e.date && r.score === e.score
}

function clearRanking() {
  if (!confirm('¿Seguro que quieres borrar todo el ranking?')) return
  store.clearRankings()
}

function goToHome() {
  router.push('/')
}
</script>

<style scoped>
.ranking-container {
  max-width: 900px;
  margin: 30px auto;
  padding: 35px;
  background: #212121;
  border-radius: 30px;
  color: white;
  text-align: center;
  box-shadow: 15px 15px 30px rgb(25, 25, 25),
              -15px -15px 30px rgb(60, 60, 60);
}

.ranking-container h2 {
  color: #ddebf0;
  margin-bottom: 35px;
  font-size: 32px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.empty-ranking {
  padding: 50px;
  background: #2a2a2a;
  border-radius: 20px;
  margin: 30px 0;
  color: #9ca3af;
  font-size: 18px;
}

/* Contenedor centrado */
.centered-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 40px 0;
}

.cards-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 25px;
  max-width: 800px;
}

.ranking-card {
  background: #DBBDBD;
  width: 140px;
  height: 180px;
  box-shadow: 0 4px 6px 0px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  transition: .3s all;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  color: #333;
  font-size: 14px;
}

.ranking-card:hover {
  transform: scale(1.08);
  filter: blur(0px);
  opacity: 1;
  box-shadow: 0 12px 25px 0px rgba(0, 0, 0, 0.4);
  background: #A82C2C;
  color: white;
  z-index: 10;
}

.cards-wrapper:hover .ranking-card:not(:hover) {
  filter: blur(3px);
  opacity: .6;
  transform: scale(.92);
  box-shadow: none;
}

/* Estilos para TOP 3 */
.top-card {
  background: #f0c050 !important;
  border: 3px solid gold;
  transform: scale(1.05);
}

.top-card:hover {
  background: #d4a72c !important;
  transform: scale(1.13) !important;
}

/* Posición actual del jugador */
.ranking-card.current {
  background: #2a5c3a !important;
  color: white !important;
  border: 3px solid #27c39f !important;
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0% { 
    border-color: #27c39f;
    box-shadow: 0 0 10px #27c39f;
  }
  50% { 
    border-color: #1ea87e;
    box-shadow: 0 0 20px #27c39f;
  }
  100% { 
    border-color: #27c39f;
    box-shadow: 0 0 10px #27c39f;
  }
}

/* Elementos dentro de la card */
.position {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 12px;
  display: block;
}

.name {
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  font-size: 16px;
}

.score {
  color: #2761c3;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
  font-size: 18px;
}

.ranking-card:hover .score {
  color: #ddebf0;
}

.accuracy {
  color: #27c39f;
  margin-bottom: 5px;
  display: block;
  font-size: 16px;
}

.time {
  color: #9ca3af;
  font-size: 12px;
  display: block;
  margin-top: 5px;
}

/* Botones */
.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.btn-home, .btn-clear {
  padding: 15px 30px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  border: none;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  min-width: 200px;
}

.btn-home {
  background: #2a2a2a;
  color: #ddebf0;
  border: 3px solid #444;
}

.btn-home:hover {
  background: #333;
  border-color: #666;
  transform: translateY(-3px);
}

.btn-clear {
  background: #ef4444;
  color: white;
}

.btn-clear:hover {
  background: #dc2626;
  transform: translateY(-2px);
}
</style>