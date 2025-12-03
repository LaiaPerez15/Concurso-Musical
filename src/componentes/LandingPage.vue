<template>
  <div class="page-container">
    <div class="card">
      <div class="landing">
        <h1>Concurso Musical</h1>
        <p>Escucha 5 segundos de una canción y adivina cuál es.</p>
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
        <div class="buttons">
          <router-link class="btn" to="/game">Jugar</router-link>
          <router-link class="btn ghost" to="/ranking">Ranking</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor centrado */
.page-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Card estilo Uiverse.io */
.card {
  width: 420px;
  padding: 25px;
  border-radius: 30px;

  background: #212121;
  color: white;

  box-shadow: 15px 15px 30px rgb(25, 25, 25),
              -15px -15px 30px rgb(60, 60, 60);
}

/* Contenido interno */
.landing {
  width: 100%;
  text-align: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 20px 0;
}

.btn {
  padding: 10px 16px;
  background: #48b46c;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
}

.ghost {
  background: transparent;
  border: 2px solid #48b46c;
  color: #48b46c;
}

.rules {
  background: #ffffff10;
  padding: 16px;
  border-radius: 10px;
  margin-top: 20px;
}

.rules ul {
  list-style: none;
  padding: 0;
}

.rules li {
  margin: 6px 0;
}
</style>
