<template>
  <div class="results">
    <h2>Resultados</h2>

    <p>Puntuación: <strong>{{ store.score }}</strong></p>
    <p>Aciertos: {{ store.correctCount }} / {{ store.sessionQuestions.length }}</p>
    <p>Precisión: {{ porcentaje }}%</p>
    <p>Tiempo escuchado: {{ store.totalTimeListening }}s</p>

    <button @click="replay">Volver a jugar</button>
    <router-link to="/ranking" class="btn">Ver ranking</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/game'
import { useRouter } from 'vue-router'

const store = useGameStore()
const router = useRouter()

const porcentaje = computed(() =>
  Math.round((store.correctCount / store.sessionQuestions.length) * 100)
)

function replay() {
  store.startGame()
  router.push('/game')
}
</script>

<style scoped>
.results { background:white; padding:20px; border-radius:10px; max-width:500px; margin:auto; }
.btn { margin-left:10px; padding:8px 16px; background:#111827; color:white; border-radius:8px; }
button { padding:8px 16px; border:none; background:#111827; color:white; border-radius:8px; cursor:pointer; }
</style>
