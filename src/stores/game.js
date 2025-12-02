import { defineStore } from 'pinia'
import { songs as defaultSongs } from '../src/data/songs'

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
      if (!this.songs.length) {
        this.songs = [...defaultSongs]
      }
    },

    setPlayerName(name) {
      this.playerName = name
    },

    startGame() {
      const shuffled = [...this.songs].sort(() => Math.random() - 0.5)
      this.sessionQuestions = shuffled.slice(0, 10).map(q => ({
        ...q,
        answers: [...q.answers].sort(() => Math.random() - 0.5)
      }))

      this.index = 0
      this.score = 0
      this.correctCount = 0
      this.totalTimeListening = 0
      this.lastEntry = null
    },

    answerCurrent(selectedIndex, timeListened) {
      const current = this.sessionQuestions[this.index]
      const selected = typeof selectedIndex === 'number' ? current.answers[selectedIndex] : null

      this.totalTimeListening += timeListened || 0

      if (selected && selected.isCorrect) {
        this.score += 10
        this.correctCount++
      } else if (selected === null) {
        // no answer = 0 points
      } else {
        this.score -= 5
      }
    },

    finishGame() {
      const fecha = new Date().toISOString()
      const porcentaje = Math.round((this.correctCount / this.sessionQuestions.length) * 100)

      const entry = {
        name: this.playerName,
        score: this.score,
        date: fecha,
        accuracy: porcentaje,
        time: this.totalTimeListening
      }

      this.rankings.push(entry)

      this.rankings.sort((a, b) =>
        b.score - a.score ||
        new Date(a.date) - new Date(b.date) ||
        a.time - b.time
      )

      this.rankings = this.rankings.slice(0, 10)
      localStorage.setItem('rankings', JSON.stringify(this.rankings))

      this.lastEntry = entry
      return entry
    },

    clearRankings() {
      this.rankings = []
      localStorage.removeItem('rankings')
    }
  }
})
