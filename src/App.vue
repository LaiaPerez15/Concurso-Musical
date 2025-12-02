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
  <router-view class="relative z-10"/>
</template>

<script setup>
  import DotGrid from "./componentes/DotGrid.vue";
</script>

<style scoped>
.dot-grid-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: -1;
}
</style>
