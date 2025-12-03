<template>
  <div class="dark-card">
    <h2>RESULTADOS FINALES</h2>

    <div class="score-summary">
      <div class="stat-box">
        <span class="stat-label">Puntuación total</span>
        <span class="stat-value">{{ store.score }} puntos</span>
      </div>

      <div class="stat-box">
        <span class="stat-label">Aciertos</span>
        <span class="stat-value">{{ store.correctCount }} / {{ store.sessionQuestions.length }}</span>
      </div>

      <div class="stat-box">
        <span class="stat-label">Precisión</span>
        <span class="stat-value">{{ porcentaje }}%</span>
      </div>

      <div class="stat-box">
        <span class="stat-label">Tiempo escuchado</span>
        <span class="stat-value">{{ store.totalTimeListening }}s</span>
      </div>
    </div>

    <!-- Ranking personalizado -->
    <div class="ranking-section">
      <h3>TU POSICIÓN EN EL RANKING</h3>

      <div v-if="userRank <= 10" class="top-ranking">
        <div class="congrats">
          <span v-if="userRank === 1">PRIMER PUESTO</span>
          <span v-else-if="userRank === 2">SEGUNDO PUESTO</span>
          <span v-else-if="userRank === 3">TERCER PUESTO</span>
          <span v-else>TOP {{ userRank }}</span>
        </div>
        <p class="rank-message">¡Estás entre los 10 mejores!</p>
      </div>

      <div v-else class="outside-ranking">
        <p class="rank-message">Tu posición: <strong>#{{ userRank }}</strong></p>
        <p class="encouragement">¡Sigue intentándolo para entrar en el TOP 10!</p>
      </div>
    </div>

    <div class="motivation" :class="motivationClass">
      {{ motivationMessage }}
    </div>

    <!-- Botones de acción -->
    <div class="actions">
      <button @click="goToRanking" class="btn-action">VER RANKING</button>
      <button @click="goToHome" class="btn-home">VOLVER AL INICIO</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/game'
import { useRouter } from 'vue-router'

const store = useGameStore()
const router = useRouter()

// Calcular porcentaje
const porcentaje = computed(() =>
  Math.round((store.correctCount / store.sessionQuestions.length) * 100)
)

// Calcular posición del usuario
const userRank = computed(() => {
  const entry = store.lastEntry
  if (!entry || !store.rankings.length) return 11

  const sorted = [...store.rankings].sort((a, b) =>
    b.score - a.score ||
    new Date(b.date) - new Date(a.date) ||
    a.time - b.time
  )

  const index = sorted.findIndex(r =>
    r.name === entry.name &&
    r.score === entry.score &&
    r.date === entry.date
  )

  return index !== -1 ? index + 1 : 11
})

// Mensaje motivacional SIN EMOJIS
const motivationMessage = computed(() => {
  const score = store.score

  if (score >= 80) return '¡EXCELENTE! Eres un experto musical.'
  if (score >= 60) return '¡MUY BIEN! Tienes buen oído musical.'
  if (score >= 40) return '¡BUEN TRABAJO! Sigue practicando.'
  if (score >= 20) return 'No está mal, pero puedes mejorar.'
  if (score > 0) return 'Hay que escuchar más música.'
  return '¡Anímate! La próxima vez será mejor.'
})

const motivationClass = computed(() => {
  const score = store.score
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  if (score >= 40) return 'average'
  return 'low'
})

function replay() {
  store.startGame()
  store.index = 0
  store.score = 0
  store.correctCount = 0
  store.totalTimeListening = 0
  store.lastEntry = null
}

function goToRanking() {
  router.push('/ranking')
}

function goToHome() {
  router.push('/')
}
</script>

<style scoped>
/* Carta negra igual que el juego */
.dark-card {
  width: 550px;
  margin: 30px auto;
  background: #212121;
  padding: 35px;
  border-radius: 30px;
  text-align: center;
  color: white;
  box-shadow: 15px 15px 30px rgb(25, 25, 25),
    -15px -15px 30px rgb(60, 60, 60);
}

.dark-card h2 {
  color: #ddebf0;
  margin-bottom: 30px;
  font-size: 28px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.score-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 35px;
}

.stat-box {
  background: #2a2a2a;
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #444;
}

.stat-label {
  display: block;
  font-size: 13px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #27c39f;
}

.ranking-section {
  margin: 35px 0;
  padding: 25px;
  background: #2a2a2a;
  border-radius: 20px;
  border: 2px solid #444;
}

.ranking-section h3 {
  color: #ddebf0;
  margin-bottom: 20px;
  font-size: 22px;
  text-transform: uppercase;
}

.top-ranking {
  padding: 20px;
}

.congrats {
  font-size: 26px;
  font-weight: bold;
  color: #f59e0b;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.rank-message {
  font-size: 18px;
  color: #ddebf0;
  margin: 10px 0;
}

.outside-ranking {
  padding: 20px;
}

.outside-ranking .rank-message {
  font-size: 20px;
  margin-bottom: 15px;
}

.outside-ranking .rank-message strong {
  color: #27c39f;
}

.encouragement {
  color: #9ca3af;
  font-size: 16px;
  margin: 10px 0;
}

.motivation {
  margin: 30px 0;
  padding: 22px;
  border-radius: 15px;
  font-size: 20px;
  font-weight: bold;
  border: 3px solid;
  text-align: center;
}

.motivation.excellent {
  background: #1a3c2e;
  color: #d1fae5;
  border-color: #27c39f;
}

.motivation.good {
  background: #1a2a3c;
  color: #dbeafe;
  border-color: #3b82f6;
}

.motivation.average {
  background: #3c2e1a;
  color: #fef3c7;
  border-color: #f59e0b;
}

.motivation.low {
  background: #3c1a1a;
  color: #fee2e2;
  border-color: #ef4444;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;
}

.btn-action,
.btn-home {
  padding: 18px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 17px;
  cursor: pointer;
  border: none;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-action {
  background: #2761c3;
  color: white;
}

.btn-action:hover {
  background: #1d4ed8;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(39, 97, 195, 0.3);
}

.btn-home {
  background: transparent;
  color: #9ca3af;
  border: 3px solid #444;
}

.btn-home:hover {
  background: #2a2a2a;
  border-color: #666;
  color: #ddebf0;
  transform: translateY(-3px);
}
</style>