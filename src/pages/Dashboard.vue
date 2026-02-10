<template>
  <div class="dashboard">
    <h1>Dashboard</h1>

    <div class="links">
      <router-link class="link-btn" to="/kit">
        <i class="fas fa-cube"></i>
        <span>Kit</span>
      </router-link>

      <router-link class="link-btn" to="/bikes">
        <i class="fas fa-map"></i>
        <span>Bikes</span>
      </router-link>
    </div>
  </div>
</template>


<script>
export default {
    name: 'Dashboard'
}
</script>

<style scoped lang="scss">
.dashboard {
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

/* GRID THAT FILLS REMAINING SPACE */
.links {
  flex: 1; /* take all remaining height */
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* BIG TILE BUTTONS */
.link-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: var(--accent);
  color: #fff;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 600;

  font-size: 1.5rem;
  gap: 12px;

  height: 100%;
  width: 100%;

  transition: transform 0.15s ease, filter 0.15s ease;
}

.link-btn i {
  font-size: 2.5rem;
}

.link-btn:hover {
  filter: brightness(0.95);
  transform: translateY(-2px);
}

/* STACK ON SMALL SCREENS */
@media (max-width: 700px) {
  .links {
    grid-template-columns: 1fr;
  }
}
</style>
