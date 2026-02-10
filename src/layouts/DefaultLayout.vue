<template>
    <div class="layout">
        <Header @toggle="toggleMenu" />

        <main class="layout-main">
            <SideMenu :isVisible="isMenuOpen" />
            <router-view />
        </main>

        <Footer />
    </div>
    <Modal v-model:isOpen="isModalOpen" title="Example Modal" @close="isModalOpen = false">
        <p>This is an example modal content.</p>
    </Modal>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'
import SideMenu from '@/components/layout/SideMenu.vue'
import Footer from '@/components/layout/Footer.vue'
import Modal from '@/components/base/Modal.vue';


import { ref } from 'vue'

const isMenuOpen = ref(true)
const isModalOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

</script>
<style scoped lang="scss">
.layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    @include theme-change;


    &-main {
        flex-grow: 1;
        display: flex;
    }
}
</style>