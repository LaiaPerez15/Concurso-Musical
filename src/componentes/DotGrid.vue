<template>
  <div class="dot-grid-wrapper">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = withDefaults(defineProps<{
  dotSize?: number,
  gap?: number,
  baseColor?: string,
  activeColor?: string,
  proximity?: number,
  maxScale?: number
}>(), {
  dotSize: 2, // MUCHO más pequeños - 2px de diámetro
  gap: 20,    // Gap más pequeño para mantener densidad
  baseColor: '#666666', // Gris un poco más claro para puntos pequeños
  activeColor: '#27FF64',
  proximity: 80, // Proximidad reducida para puntos pequeños
  maxScale: 8    // Escala máxima mayor para que el crecimiento sea más dramático
});

interface Dot {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  currentSize: number;
  targetSize: number;
  originalSize: number;
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
const dots = ref<Dot[]>([]);
const pointer = ref({ x: -1000, y: -1000 });

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

const baseRgb = hexToRgb(props.baseColor!);
const activeRgb = hexToRgb(props.activeColor!);

// Construir grid de puntos
function buildGrid() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.scale(devicePixelRatio, devicePixelRatio);

  dots.value = [];
  const cols = Math.floor((width + props.gap!) / (props.dotSize! + props.gap!));
  const rows = Math.floor((height + props.gap!) / (props.dotSize! + props.gap!));
  const cell = props.dotSize! + props.gap!;
  const extraX = width - (cols * cell - props.gap!);
  const extraY = height - (rows * cell - props.gap!);
  const startX = extraX / 2 + props.dotSize!/2;
  const startY = extraY / 2 + props.dotSize!/2;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      dots.value.push({
        cx: startX + x * cell,
        cy: startY + y * cell,
        xOffset: 0,
        yOffset: 0,
        currentSize: props.dotSize!,
        targetSize: props.dotSize!,
        originalSize: props.dotSize!
      });
    }
  }
}

// Crear gradiente para efecto esférico
function createSphereGradient(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isActive: boolean) {
  const gradient = ctx.createRadialGradient(
    x - size/4, y - size/4, size * 0.1,
    x, y, size/2
  );

  if (isActive) {
    // Gradiente para estado activo (verde con volumen)
    gradient.addColorStop(0, '#7AFFA3'); // Luz brillante
    gradient.addColorStop(0.4, '#27FF64'); // Color principal
    gradient.addColorStop(0.8, '#1EBD4F'); // Sombra
    gradient.addColorStop(1, '#158538');   // Sombra oscura
  } else {
    // Para puntos muy pequeños, usar color sólido o gradiente simple
    if (size <= 3) {
      return `rgb(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b})`;
    }
    // Gradiente para estado inactivo (gris con volumen) solo si el punto es lo suficientemente grande
    gradient.addColorStop(0, '#888888');
    gradient.addColorStop(0.5, '#666666');
    gradient.addColorStop(1, '#444444');
  }

  return gradient;
}

// Animación suave del tamaño de los puntos
function animateDots() {
  for (const dot of dots.value) {
    dot.currentSize += (dot.targetSize - dot.currentSize) * 0.2; // Animación más rápida
  }
}

// Dibujar puntos con efecto esférico
let rafId: number;
function draw() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Actualizar animaciones de tamaño
  animateDots();

  for (const dot of dots.value) {
    const dx = dot.cx - pointer.value.x;
    const dy = dot.cy - pointer.value.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let isActive = false;
    let targetSize = dot.originalSize;

    if (dist < props.proximity!) {
      const t = 1 - dist / props.proximity!;
      isActive = true;
      // Calcular nuevo tamaño basado en la proximidad
      targetSize = dot.originalSize + (dot.originalSize * (props.maxScale! - 1) * t);
    }

    // Establecer el tamaño objetivo para la animación
    dot.targetSize = targetSize;

    // Para puntos muy pequeños, dibujar de forma simple
    if (dot.currentSize <= 3 && !isActive) {
      ctx.beginPath();
      ctx.arc(dot.cx, dot.cy, dot.currentSize/2, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b})`;
      ctx.fill();
    } else {
      // Crear y aplicar gradiente esférico para puntos más grandes
      const gradient = createSphereGradient(ctx, dot.cx, dot.cy, dot.currentSize, isActive);

      // Dibujar el punto con efecto de volumen
      ctx.beginPath();
      ctx.arc(dot.cx, dot.cy, dot.currentSize/2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Añadir brillo extra para mayor efecto 3D (solo para puntos activos y grandes)
      if (isActive && dot.currentSize > 4) {
        const highlightGradient = ctx.createRadialGradient(
          dot.cx - dot.currentSize/4,
          dot.cy - dot.currentSize/4,
          0,
          dot.cx - dot.currentSize/4,
          dot.cy - dot.currentSize/4,
          dot.currentSize * 0.3
        );
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(dot.cx - dot.currentSize/6, dot.cy - dot.currentSize/6, dot.currentSize * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = highlightGradient;
        ctx.fill();
      }
    }
  }

  rafId = requestAnimationFrame(draw);
}

// Capturar movimiento del cursor
function onMouseMove(e: MouseEvent) {
  pointer.value.x = e.clientX;
  pointer.value.y = e.clientY;
}

onMounted(() => {
  buildGrid();
  draw();
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', buildGrid);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('resize', buildGrid);
});
</script>

<style>
.dot-grid-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
}
.dot-grid-wrapper canvas {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}
</style>
