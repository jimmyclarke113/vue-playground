<template>
  <Transition name="slide-menu">
    <aside v-if="isVisible" class="side-menu">
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/kit">Kit</a>
          </li>
          <li>
            <a href="/bikes">Bikes</a>
          </li>
        </ul>
      </nav>
    </aside>
  </Transition>
</template>

<script setup>
defineProps({
  isVisible: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.side-menu {
  background-color: var(--altbg);
  color: var(--text);
  height: 100vh;
  width: 250px;
  position: absolute;
  overflow: hidden;
}

@media (min-width: 400px) {
  .side-menu {
    position: relative;
  }
}

.side-menu nav {
  padding: 20px;
}

.side-menu nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.side-menu nav li {
  margin-bottom: 10px;
}

.side-menu nav a {
  display: block;
  padding: 10px 15px;
  color: var(--accent);
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.side-menu nav a:hover {
  background-color: #e0e0e0;
}

/* Transition */
.slide-menu-enter-active,
.slide-menu-leave-active {
  transition: all 0.3s ease;
}

.slide-menu-enter-from,
.slide-menu-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
