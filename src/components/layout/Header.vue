<template>
  <header class="header">
    <MenuToggle @toggle="emit('toggle')" />
    <div class="logo-placeholder"></div>
    <ThemeToggle />
  </header>
</template>

<script setup>
import ThemeToggle from '../base/ThemeToggle.vue'
import MenuToggle from '../base/MenuToggle.vue'

const emit = defineEmits(['toggle'])
</script>

<style scoped>
.header {
  z-index: +1;
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: var(--accent);
  color: var(--text);
  justify-content: space-between;
  box-shadow: 0 2px 4px var(--secondary);
}

.logo-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--secondary);
}
</style>
