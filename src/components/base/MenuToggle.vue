<template>
    <button
        class="menu-toggle"
        @click="toggleMenu"
        :aria-expanded="isVisible"
        aria-label="Toggle menu"
    >
        <span class="menu-toggle__icon">
            <span class="menu-toggle__line"></span>
            <span class="menu-toggle__line"></span>
            <span class="menu-toggle__line"></span>
        </span>
    </button>
</template>

<script setup>
const props = defineProps({
    isVisible: {
        type: Boolean,
        default: true,
    },
})

const emit = defineEmits(['toggle'])

const toggleMenu = () => {
    const next = !props.isVisible
    emit('toggle', next)
}
</script>

<style scoped>
.menu-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.menu-toggle__icon {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.menu-toggle__line {
    width: 25px;
    height: 3px;
    background-color: currentColor;
    transition: all 0.3s ease;
}

.menu-toggle:hover .menu-toggle__line {
    background-color: #333;
}
</style>