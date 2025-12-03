<template>
  <div>
    <PlayerNameModal v-if="!store.playerName" />

    <div v-else class="game-container">
      <div class="game-header">
        <h2>Jugador: {{ store.playerName }}</h2>
        <div class="stats">
          <span class="stat">Puntos: <strong>{{ store.score }}</strong></span>
          <span class="stat">Aciertos: {{ store.correctCount }}/{{ store.sessionQuestions.length }}</span>
          <span class="stat">Pregunta: {{ store.index + 1 }}/{{ store.sessionQuestions.length }}</span>
        </div>
      </div>

      <!-- Mostrar solo QuestionCard si hay preguntas y no ha terminado -->
      <QuestionCard v-if="current && !gameFinished" :key="current.id" :question="current" :qNumber="store.index + 1"
        :total="store.sessionQuestions.length" @answered="onAnswered" />

      <!-- Mostrar ResultsView cuando termine el juego -->
      <ResultsView v-else-if="gameFinished" @go-to-ranking="goToRanking" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useGameStore } from '../stores/game'
import { useRouter } from 'vue-router'
import PlayerNameModal from './PlayerNameModal.vue'
import QuestionCard from './QuestionCard.vue'
import ResultsView from './ResultsView.vue'

const store = useGameStore()
const router = useRouter()
const gameFinished = ref(false)

store.init()

const current = computed(() => store.sessionQuestions[store.index] || null)

function onAnswered(payload) {
  store.answerCurrent(payload.selectedIndex, payload.timeListened)

  // Verificar si es la última pregunta
  if (store.index >= store.sessionQuestions.length - 1) {
    // Última pregunta respondida, terminar juego
    store.finishGame()
    gameFinished.value = true
  } else {
    // Avanzar a siguiente pregunta
    store.index++
  }
}

function goToRanking() {
  router.push('/ranking')
}

// Watch para detectar cuando se termina el juego
watch(() => store.sessionQuestions.length, (newLength) => {
  if (newLength > 0 && store.index >= newLength - 1) {
    gameFinished.value = true
  }
})

// También verificar al montar
if (store.sessionQuestions.length > 0 && store.index >= store.sessionQuestions.length - 1) {
  gameFinished.value = true
}
</script>

<style scoped>
.game-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.game-header {
  background: white;
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.game-header h2 {
  margin: 0 0 10px 0;
  color: #1f2937;
}

.stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat {
  background: #f3f4f6;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 14px;
  color: #4b5563;
}

.stat strong {
  color: #3b82f6;
}
</style>