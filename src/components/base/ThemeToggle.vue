<template>
  <button
    @click="toggleTheme"
    class="theme-toggle"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <FontAwesomeIcon :icon="isDark ? 'sun' : 'moon'" />
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSun, faMoon)

const isDark = ref(false)

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute(
    'data-theme',
    isDark.value ? 'dark' : 'light'
  )
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
</script>

<script>
export default {
  components: {
    FontAwesomeIcon,
  },
}
</script>

<style scoped>
.theme-toggle {
  font-size: 1.5rem;
  cursor: pointer;
  background: none;
  border: none;
  color: var(--text);
}
</style>