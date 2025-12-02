<template>
  <div>
    <PlayerNameModal v-if="!store.playerName" />

    <div v-else>
      <h2>Jugador: {{ store.playerName }}</h2>

      <QuestionCard
        v-if="current"
        :question="current"
        :qNumber="store.index + 1"
        :total="store.sessionQuestions.length"
        @answered="onAnswered"
      />

      <ResultsView v-else />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../src/stores/game'
import PlayerNameModal from './src/componentes/PlayerNameModal.vue'
import QuestionCard from './src/componentes/QuestionCard.vue'
import ResultsView from './src/componentes/ResultsView.vue'

const store = useGameStore()
store.init()

const current = computed(() => store.sessionQuestions[store.index] || null)

function onAnswered(payload) {
  store.answerCurrent(payload.selectedIndex, payload.timeListened)
  if (store.index < store.sessionQuestions.length - 1) store.index++
  else store.finishGame()
}
</script>
