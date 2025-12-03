import { defineStore } from 'pinia'
import { songs as defaultSongs } from '../data/songs'

export const useGameStore = defineStore('game', {
  state: () => ({
    playerName: '',
    songs: [],
    sessionQuestions: [],
    index: 0,
    score: 0,
    correctCount: 0,
    totalTimeListening: 0,
    rankings: JSON.parse(localStorage.getItem('rankings') || '[]'),
    lastEntry: null
  }),

  actions: {
    init() {
      if (this.songs.length === 0) {
        this.songs = [...defaultSongs]
      }
    },

    setPlayerName(name) {
      this.playerName = name
    },

    startGame() {
      // 1. Mezclar todas las canciones
      const allShuffled = [...this.songs].sort(() => Math.random() - 0.5)
      
      // 2. Tomar 10 primeras
      const selectedQuestions = allShuffled.slice(0, 10)
      
      // 3. Mezclar respuestas de cada pregunta
      this.sessionQuestions = selectedQuestions.map(q => ({
        ...q,
        answers: [...q.answers].sort(() => Math.random() - 0.5)
      }))

      // 4. Resetear juego
      this.index = 0
      this.score = 0
      this.correctCount = 0
      this.totalTimeListening = 0
      this.lastEntry = null
    },

    answerCurrent(selectedIndex, timeListened) {
      const currentQuestion = this.sessionQuestions[this.index]
      
      // Sumar tiempo escuchado (si hay)
      if (timeListened && timeListened > 0) {
        this.totalTimeListening += timeListened
      }
      
      // Caso 1: No respondió (tiempo agotado)
      if (selectedIndex === null) {
        // 0 puntos - no hacer nada más
        return
      }
      
      // Caso 2: Respondió
      const selectedAnswer = currentQuestion.answers[selectedIndex]
      
      if (selectedAnswer.isCorrect) {
        // ACIERTO: +10 puntos
        this.score += 10
        this.correctCount++
      } else {
        // ERROR: -5 puntos (mínimo 0)
        this.score = Math.max(0, this.score - 5)
      }
    },

    finishGame() {
      // Calcular porcentaje de aciertos
      const accuracy = this.sessionQuestions.length > 0
        ? Math.round((this.correctCount / this.sessionQuestions.length) * 100)
        : 0

      // Crear entrada para el ranking
      const newEntry = {
        name: this.playerName,
        score: this.score,
        date: new Date().toISOString(),
        accuracy: accuracy,
        time: this.totalTimeListening
      }

      // Añadir a rankings
      this.rankings.push(newEntry)
      
      // Ordenar: 1º puntuación (mayor primero), 2º fecha (más reciente primero), 3º tiempo (menor primero)
      this.rankings.sort((a, b) => {
        // 1. Por puntuación (descendente)
        if (b.score > a.score) return 1
        if (b.score < a.score) return -1
        
        // 2. Por fecha (más reciente primero)
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        if (dateB > dateA) return 1
        if (dateB < dateA) return -1
        
        // 3. Por tiempo (menor primero)
        return a.time - b.time
      })

      // Mantener solo top 10
      if (this.rankings.length > 10) {
        this.rankings = this.rankings.slice(0, 10)
      }

      // Guardar en localStorage
      localStorage.setItem('rankings', JSON.stringify(this.rankings))
      
      // Guardar como última entrada
      this.lastEntry = newEntry
      
      return newEntry
    },

    clearRankings() {
      this.rankings = []
      localStorage.removeItem('rankings')
    }
  }
})