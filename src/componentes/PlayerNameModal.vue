<template>
  <div class="box">
    <h2>Introduce tu nombre</h2>
    <input v-model="name" @keyup.enter="start" placeholder="Tu nombre" />
    <button @click="start">Comenzar</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '../stores/game'
import { useRouter } from 'vue-router'

const store = useGameStore()
const router = useRouter()
const name = ref(store.playerName || '')

function start() {
  if (!name.value.trim()) return alert('Introduce un nombre')
  store.setPlayerName(name.value)
  store.startGame()
  router.push('/game')
}
</script>

<style scoped>
.box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 360px;
  margin: auto;
}
input {
  padding: 8px;
  border: 1px solid #ccc;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 6px;
}
button {
  width: 100%;
  padding: 10px;
  background: #111827;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
