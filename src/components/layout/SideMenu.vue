<template>
  <Transition name="slide-menu">
    <aside v-if="isVisible" class="side-menu">
      <nav>
        <ul>
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li>
            <router-link to="/kit">Kit</router-link>
          </li>
          <li>
            <router-link to="/bikes">Bikes</router-link>
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
  top: 0;
  left: 0;
  z-index: 1000;
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

.side-menu nav a.router-link-exact-active {
  background-color: var(--accent);
  color: white;
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
