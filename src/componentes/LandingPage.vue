<template>
  <div class="landing">
    <h1>Concurso Musical</h1>
    <p>Escucha 5 segundos de una canción y adivina cuál es.</p>

    <div class="buttons">
      <router-link class="btn" to="/game">Jugar</router-link>
      <router-link class="btn ghost" to="/ranking">Ranking</router-link>
    </div>

    <section class="rules">
      <h2>Reglas</h2>
      <ul>
        <li>10 preguntas aleatorias</li>
        <li>+10 puntos por acierto</li>
        <li>-5 puntos por fallo</li>
        <li>0 si no respondes</li>
        <li>Ranking para el Top 10</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.landing {
  max-width: 780px;
  margin: auto;
}
.buttons {
  display: flex;
  gap: 12px;
  margin: 20px 0;
}
.btn {
  padding: 10px 16px;
  background: #111827;
  color: white;
  border-radius: 8px;
  text-decoration: none;
}
.ghost {
  background: transparent;
  border: 1px solid #111827;
  color: #111827;
}
.rules {
  background: white;
  padding: 16px;
  border-radius: 10px;
}
</style>
