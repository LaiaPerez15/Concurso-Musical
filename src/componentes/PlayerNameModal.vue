<template>
  <div class="page-container">
    <div class="card">
      <h2 class="title">Introduce tu nombre</h2>

      <!-- Input brutalista -->
      <div class="brutalist-container">
        <input
          v-model="name"
          @keyup.enter="start"
          placeholder="Tu nombre"
          class="brutalist-input smooth-type"
          type="text"
        />
      </div>

      <button class="start-btn" @click="start">Comenzar</button>
    </div>
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
/* ---------- CONTENEDOR CENTRADO ---------- */
.page-container {
  width: 100%;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
}

/* ---------- CARD UIVERSE STYLE ---------- */
.card {
  width: 380px;
  padding: 30px;
  border-radius: 30px;

  background: #212121;
  color: white;

  text-align: center;

  box-shadow: 15px 15px 30px rgb(25, 25, 25),
              -15px -15px 30px rgb(60, 60, 60);
}

.title {
  margin-bottom: 55px;
  font-size: 22px;
  font-weight: bold;
}

/* ---------- BOTÓN ---------- */
.start-btn {
  width: 100%;
  margin-top: 25px;
  padding: 12px 16px;

  background: #48b46c;
  color: white;

  border: none;
  border-radius: 10px;

  font-size: 16px;
  font-weight: bold;

  cursor: pointer;
}

.start-btn:hover {
  background: #3b9a59;
}

/* ---------- INPUT BRUTALISTA (DE UIVERSE.IO) ---------- */
.brutalist-container {
  position: relative;
  width: 200px;
  margin: 0 65px;
  margin-bottom: 35px;
  font-family: monospace;
}

.brutalist-input {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #000;
  background-color: #fff;
  border: 4px solid #000;
  position: relative;
  overflow: hidden;
  border-radius: 0;
  outline: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 5px 5px 0 #000, 10px 10px 0 #3b9a59;
}

@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

.brutalist-input:focus::after {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: white;
  z-index: -1;
}

.brutalist-input:focus::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  z-index: -2;
  clip-path: inset(0 100% 0 0);
  animation: glitch-slice 4s steps(2, end) infinite;
}

@keyframes glitch-slice {
  0% { clip-path: inset(0 100% 0 0); }
  10% { clip-path: inset(0 5% 0 0); }
  20% { clip-path: inset(0 80% 0 0); }
  30% { clip-path: inset(0 10% 0 0); }
  40% { clip-path: inset(0 50% 0 0); }
  50% { clip-path: inset(0 30% 0 0); }
  60% { clip-path: inset(0 70% 0 0); }
  70% { clip-path: inset(0 15% 0 0); }
  80% { clip-path: inset(0 90% 0 0); }
  90% { clip-path: inset(0 5% 0 0); }
  100% { clip-path: inset(0 100% 0 0); }
}

.brutalist-input:focus + .brutalist-label {
  transform: rotate(0deg) scale(1.05);
  background-color: #4a90e2;
}

.smooth-type {
  position: relative;
  overflow: hidden;
}

.smooth-type::before {
  content: "";
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.smooth-type:focus::before {
  opacity: 1;
  animation: type-gradient 2s linear infinite;
}

@keyframes type-gradient {
  0% { background-position: 300px 0; }
  100% { background-position: 0 0; }
}

.brutalist-input::placeholder {
  color: #888;
  transition: color 0.3s ease;
}

.brutalist-input:focus::placeholder {
  color: transparent;
}

@keyframes focus-pulse {
  0%, 100% { border-color: #000; }
  50% { border-color: #3b9a59; }
}
</style>
