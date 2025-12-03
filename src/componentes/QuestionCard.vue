<template>
    <div class="dark-card">
        <h2>PREGUNTA {{ qNumber }} / {{ total }}</h2>
        <p class="question-text">{{ question.text }}</p>

        <!-- Botón de audio más grande -->
        <div class="audio-section">
            <button @click="playRandomSegment" :disabled="isPlaying || hasAnswered" class="play-btn">
                {{ isPlaying ? 'REPRODUCIENDO...' : 'ESCUCHAR 5s' }}
                <div id="clip">
                    <div id="leftTop" class="corner"></div>
                    <div id="rightBottom" class="corner"></div>
                    <div id="rightTop" class="corner"></div>
                    <div id="leftBottom" class="corner"></div>
                </div>
                <span id="rightArrow" class="arrow"></span>
                <span id="leftArrow" class="arrow"></span>
            </button>

            <div v-if="isPlaying" class="audio-progress">
                <div class="progress-bar" :style="{ width: playProgress + '%' }"></div>
                <span>{{ currentPlayTime.toFixed(1) }}s / 5s</span>
            </div>

            <p v-if="audioPlayed && !isPlaying" class="audio-status">✓ Fragmento escuchado</p>
        </div>

        <!-- Respuestas -->
        <div class="answers">
            <button v-for="(answer, index) in question.answers" :key="index" class="answer-btn"
                :class="getAnswerClass(index)" @click="selectAnswer(index)" :disabled="hasAnswered || isPlaying">
                {{ answer.text }}
            </button>
        </div>

        <!-- Timer y puntos -->
        <div class="game-info">
            <p class="timer" :class="{ warning: timeLeft <= 3 }">
                TIEMPO: {{ timeLeft }}s
            </p>
            <p class="points">PUNTOS: <strong>{{ store.score }}</strong></p>
        </div>

        <!-- Feedback sin emojis -->
        <div v-if="feedbackMessage" class="feedback" :class="feedbackType">
            {{ feedbackMessage }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../stores/game'

const props = defineProps({
    question: Object,
    qNumber: Number,
    total: Number
})

const emit = defineEmits(['answered'])

const store = useGameStore()

// Estado
const timeLeft = ref(10)
const isPlaying = ref(false)
const audioPlayed = ref(false)
const hasAnswered = ref(false)
const selectedIndex = ref(null)
const playProgress = ref(0)
const currentPlayTime = ref(0)
const feedbackMessage = ref('')
const feedbackType = ref('')
const audioDuration = ref(0)

let mainTimer
let progressTimer
let audioTimer
let audioElement = null

// Reproducir segmento ALEATORIO
async function playRandomSegment() {
    if (hasAnswered.value || isPlaying.value) return

    try {
        console.log('Cargando audio para segmento aleatorio')

        // Crear audio temporal para obtener duración
        const tempAudio = new Audio(props.question.audioPath)

        // Esperar metadata
        await new Promise((resolve) => {
            if (tempAudio.readyState >= 1) {
                resolve()
            } else {
                tempAudio.onloadedmetadata = resolve
                setTimeout(resolve, 800) // Más tiempo para cargar
            }
        })

        audioDuration.value = tempAudio.duration || 180 // Fallback 3 minutos
        console.log(`Duración total: ${audioDuration.value.toFixed(1)}s`)

        // Calcular punto de inicio aleatorio (asegurando 5 segundos disponibles)
        let startTime = 0
        if (audioDuration.value > 5) {
            startTime = Math.random() * (audioDuration.value - 5)
        }
        console.log(`Iniciando en: ${startTime.toFixed(1)}s`)

        // Crear audio para reproducir
        if (audioElement) {
            audioElement.pause()
            audioElement = null
        }

        audioElement = new Audio(props.question.audioPath)
        audioElement.currentTime = startTime

        // Eventos
        audioElement.onplay = () => {
            console.log(`Reproduciendo desde ${startTime.toFixed(1)}s`)
            isPlaying.value = true
            audioPlayed.value = true
            startProgressTimer()
        }

        audioElement.onerror = (e) => {
            console.error('Error audio:', e)
            isPlaying.value = false
            audioPlayed.value = true // Marcar como escuchado para continuar
        }

        // Reproducir
        setTimeout(() => {
            if (!hasAnswered.value) {
                audioElement.play().catch(e => {
                    console.log('Fallback: reproduciendo desde inicio')
                    // Fallback: intentar desde el principio
                    audioElement.currentTime = 0
                    audioElement.play().catch(() => {
                        audioPlayed.value = true
                    })
                })

                // Detener después de 5 segundos
                audioTimer = setTimeout(() => {
                    if (audioElement && !audioElement.paused) {
                        audioElement.pause()
                    }
                    isPlaying.value = false
                    playProgress.value = 100
                    currentPlayTime.value = 5
                    clearInterval(progressTimer)
                }, 5000)
            }
        }, 300)

    } catch (error) {
        console.error('🔥 Error en playRandomSegment:', error)
        // No bloquear el juego si falla
        audioPlayed.value = true
    }
}

// Timer progreso
function startProgressTimer() {
    playProgress.value = 0
    currentPlayTime.value = 0

    clearInterval(progressTimer)

    progressTimer = setInterval(() => {
        if (playProgress.value < 100 && isPlaying.value) {
            playProgress.value += 20
            currentPlayTime.value += 1
        }
    }, 1000)
}

// Seleccionar respuesta
function selectAnswer(index) {
    if (hasAnswered.value) return

    hasAnswered.value = true
    selectedIndex.value = index

    const isCorrect = props.question.answers[index].isCorrect

    // Detener timers
    clearInterval(mainTimer)
    clearTimeout(audioTimer)
    clearInterval(progressTimer)

    // Detener audio
    if (audioElement) {
        audioElement.pause()
        audioElement = null
    }

    // Feedback SIN EMOJIS
    if (isCorrect) {
        feedbackMessage.value = '¡CORRECTO! +10 puntos'
        feedbackType.value = 'correct'
    } else {
        feedbackMessage.value = 'INCORRECTO -5 puntos'
        feedbackType.value = 'wrong'
    }

    // Enviar respuesta
    setTimeout(() => {
        emit('answered', {
            selectedIndex: index,
            timeListened: audioPlayed.value ? 5 : 0,
            isCorrect: isCorrect
        })
    }, 1500)
}

// Clases para respuestas
function getAnswerClass(index) {
    if (!hasAnswered.value) return ''

    const answer = props.question.answers[index]

    if (index === selectedIndex.value) {
        return answer.isCorrect ? 'selected-correct' : 'selected-wrong'
    }

    if (answer.isCorrect) {
        return 'correct-answer'
    }

    return ''
}

// Timer principal
onMounted(() => {
    mainTimer = setInterval(() => {
        timeLeft.value--

        if (timeLeft.value <= 0) {
            clearInterval(mainTimer)
            hasAnswered.value = true
            feedbackMessage.value = '¡TIEMPO AGOTADO!'
            feedbackType.value = 'timeout'

            // Detener audio
            if (audioElement) {
                audioElement.pause()
                audioElement = null
            }
            clearTimeout(audioTimer)
            clearInterval(progressTimer)

            // Enviar respuesta
            setTimeout(() => {
                emit('answered', {
                    selectedIndex: null,
                    timeListened: audioPlayed.value ? 5 : 0,
                    isCorrect: false
                })
            }, 1500)
        }
    }, 1000)
})

// Limpieza
onUnmounted(() => {
    clearInterval(mainTimer)
    clearTimeout(audioTimer)
    clearInterval(progressTimer)

    if (audioElement) {
        audioElement.pause()
        audioElement = null
    }
})
</script>

<style scoped>
/* Carta negra */
.dark-card {
    width: 550px;
    margin: 30px auto;
    background: #212121;
    padding: 35px;
    border-radius: 30px;
    text-align: center;
    color: white;
    box-shadow: 15px 15px 30px rgb(25, 25, 25),
        -15px -15px 30px rgb(60, 60, 60);
}

.dark-card h2 {
    color: #ddebf0;
    margin-bottom: 25px;
    font-size: 26px;
    letter-spacing: 1px;
}

.question-text {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 35px;
    color: #ddebf0;
    line-height: 1.5;
}

.audio-section {
    margin: 30px 0;
}

/* Botón PLAY MÁS GRANDE */
.play-btn {
    position: relative;
    width: 15em;
    /* MÁS ANCHO */
    height: 5em;
    /* MÁS ALTO */
    outline: none;
    transition: 0.1s;
    background-color: transparent;
    border: none;
    font-size: 16px;
    /* TEXTO MÁS GRANDE */
    font-weight: bold;
    color: #ddebf0;
    cursor: pointer;
    margin: 0 auto;
    display: block;
    letter-spacing: 2px;
}

.play-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.play-btn:disabled:hover #clip {
    animation: none;
    --color: #2761c3;
}

.play-btn:disabled:hover .arrow,
.play-btn:disabled:hover .corner {
    animation: none;
    background-color: #2761c3;
}

#clip {
    --color: #2761c3;
    position: absolute;
    top: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    border: 6px double var(--color);
    /* BORDE MÁS GRUESO */
    box-shadow: inset 0px 0px 20px #195480;
    /* SOMBRA MÁS FUERTE */
    -webkit-clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
}

.arrow {
    position: absolute;
    transition: 0.2s;
    background-color: #2761c3;
    top: 35%;
    width: 12%;
    height: 30%;
}

#leftArrow {
    left: -14%;
    -webkit-clip-path: polygon(100% 0, 100% 100%, 0 50%);
}

#rightArrow {
    -webkit-clip-path: polygon(100% 49%, 0 0, 0 100%);
    left: 102%;
}

.play-btn:not(:disabled):hover #rightArrow {
    background-color: #27c39f;
    left: -16%;
    animation: 0.6s ease-in-out both infinite alternate rightArrow8;
}

.play-btn:not(:disabled):hover #leftArrow {
    background-color: #27c39f;
    left: 104%;
    animation: 0.6s ease-in-out both infinite alternate leftArrow8;
}

.corner {
    position: absolute;
    width: 5em;
    /* ESQUINAS MÁS GRANDES */
    height: 5em;
    background-color: #2761c3;
    box-shadow: inset 2px 2px 10px #2781c3;
    /* SOMBRA MÁS FUERTE */
    transform: scale(1) rotate(45deg);
    transition: 0.2s;
}

#rightTop {
    top: -2.3em;
    left: 90%;
}

#leftTop {
    top: -2.3em;
    left: -3.5em;
}

#leftBottom {
    top: 2.5em;
    left: -2.5em;
}

#rightBottom {
    top: 45%;
    left: 87%;
}

.play-btn:not(:disabled):hover #leftTop {
    animation: 0.1s ease-in-out 0.05s both changeColor8,
        0.2s linear 0.4s both lightEffect8;
}

.play-btn:not(:disabled):hover #rightTop {
    animation: 0.1s ease-in-out 0.15s both changeColor8,
        0.2s linear 0.4s both lightEffect8;
}

.play-btn:not(:disabled):hover #rightBottom {
    animation: 0.1s ease-in-out 0.25s both changeColor8,
        0.2s linear 0.4s both lightEffect8;
}

.play-btn:not(:disabled):hover #leftBottom {
    animation: 0.1s ease-in-out 0.35s both changeColor8,
        0.2s linear 0.4s both lightEffect8;
}

.play-btn:not(:disabled):hover .corner {
    transform: scale(1.3) rotate(45deg);
    /* ESCALA MAYOR */
}

.play-btn:not(:disabled):hover #clip {
    animation: 0.2s ease-in-out 0.55s both greenLight8;
    --color: #27c39f;
}

@keyframes changeColor8 {
    from {
        background-color: #2781c3;
    }

    to {
        background-color: #27c39f;
    }
}

@keyframes lightEffect8 {
    from {
        box-shadow: 1px 1px 8px #27c39f;
    }

    to {
        box-shadow: 0 0 4px #27c39f;
    }
}

@keyframes greenLight8 {
    to {
        box-shadow: inset 0px 0px 40px #27c39f;
    }
}

@keyframes leftArrow8 {
    from {
        transform: translate(0px);
    }

    to {
        transform: translateX(12px);
    }
}

@keyframes rightArrow8 {
    from {
        transform: translate(0px);
    }

    to {
        transform: translateX(-12px);
    }
}

/* Barra de progreso */
.audio-progress {
    margin-top: 25px;
    background: #333;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
}

.progress-bar {
    height: 100%;
    background: #27c39f;
    transition: width 1s linear;
}

.audio-progress span {
    position: absolute;
    right: 10px;
    top: -25px;
    font-size: 14px;
    color: #ddebf0;
    font-weight: bold;
}

.audio-status {
    margin-top: 15px;
    color: #27c39f;
    font-weight: bold;
    font-size: 16px;
}

/* Respuestas */
.answers {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: 35px 0;
}

.answer-btn {
    width: 100%;
    padding: 18px;
    background: #2a2a2a;
    border: 3px solid #444;
    border-radius: 12px;
    font-size: 17px;
    color: #ddebf0;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
    font-weight: 500;
}

.answer-btn:hover:not(:disabled) {
    border-color: #2761c3;
    background: #333;
    transform: translateY(-2px);
}

.answer-btn:disabled {
    cursor: not-allowed;
    opacity: 0.7;
}

/* Estados de respuestas */
.selected-correct {
    background: #1a3c2e !important;
    border-color: #27c39f !important;
    color: #d1fae5 !important;
    font-weight: bold;
}

.selected-wrong {
    background: #3c1a1a !important;
    border-color: #ef4444 !important;
    color: #fee2e2 !important;
    font-weight: bold;
}

.correct-answer {
    background: #1a3c2e !important;
    border-color: #27c39f !important;
    color: #d1fae5 !important;
    font-weight: bold;
}

/* Info del juego */
.game-info {
    display: flex;
    justify-content: space-between;
    margin: 30px 0;
    padding: 20px;
    background: #2a2a2a;
    border-radius: 12px;
    border: 2px solid #444;
    font-size: 18px;
}

.timer {
    font-weight: bold;
    color: #ddebf0;
}

.timer.warning {
    color: #ef4444;
    animation: pulse 1s infinite;
}

.points {
    color: #ddebf0;
}

.points strong {
    color: #27c39f;
}

@keyframes pulse {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
}

/* Feedback SIN EMOJIS */
.feedback {
    margin-top: 30px;
    padding: 20px;
    border-radius: 12px;
    font-weight: bold;
    font-size: 20px;
    animation: slideIn 0.3s ease;
    border: 3px solid;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.feedback.correct {
    background: #1a3c2e;
    color: #d1fae5;
    border-color: #27c39f;
}

.feedback.wrong {
    background: #3c1a1a;
    color: #fee2e2;
    border-color: #ef4444;
}

.feedback.timeout {
    background: #3c2e1a;
    color: #fef3c7;
    border-color: #f59e0b;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-15px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>