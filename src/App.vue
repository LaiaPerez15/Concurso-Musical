<template>
  <div class="dot-grid-container">
    <DotGrid
      :dot-size="2"
      :gap="12"
      base-color="#2d6938"
      active-color="#d1fbd6"
      :proximity="100"
      :max-scale="10"
    />
  </div>

  <div class="content">
    <router-view class="relative z-10"/>
  </div>
</template>

<script setup>
import DotGrid from "./src/components/DotGrid.vue";
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

.dot-grid-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: -1;
}

/* Para que tus páginas tengan un margen y no peguen al borde */
.content {
  position: relative;
  z-index: 10;
  padding: 20px;
}
</style>
