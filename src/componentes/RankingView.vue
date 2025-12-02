<template>
  <div class="ranking">
    <h2>Ranking TOP 10</h2>

    <div v-if="!store.rankings.length">Aún no hay puntuaciones. ¡Juega para aparecer aquí!</div>

    <ol v-else>
      <li v-for="(r, i) in store.rankings" :key="i" :class="{ current: isLast(r) }">
        <span class="pos">
          <span v-if="i === 0">🥇</span>
          <span v-else-if="i === 1">🥈</span>
          <span v-else-if="i === 2">🥉</span>
          <span v-else>{{ i + 1 }}</span>
        </span>

        <span>{{ r.name }}</span>
        <span>{{ r.score }} pts</span>
        <span>{{ r.accuracy }}%</span>
        <span>{{ r.time }}s</span>
      </li>
    </ol>

    <button @click="clear">Borrar ranking</button>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/game.js'
const store = useGameStore()

function isLast(r) {
  const e = store.lastEntry
  return e && r.name === e.name && r.date === e.date && r.score === e.score
}

function clear() {
  if (!confirm('¿Seguro?')) return
  store.clearRankings()
}
</script>

<style scoped>
ol {
  padding: 0;
  list-style: none;
}
li {
  display: flex;
  gap: 12px;
  padding: 10px;
  background: white;
  margin-bottom: 6px;
  border-radius: 8px;
}
.current {
  background: #fef9c3;
}
.pos {
  width: 40px;
  font-weight: bold;
}
button {
  margin-top: 20px;
  padding: 8px 16px;
  background: #ef4444;
  border: none;
  color: white;
  border-radius: 8px;
}
</style>
