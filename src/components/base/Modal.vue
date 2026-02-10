<template>
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>{{ title }}</h2>
                <button class="modal-close" @click="closeModal">&times;</button>
            </div>
            <div class="modal-body">
                <slot></slot>
            </div>
            <div class="modal-footer" v-if="$slots.footer">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Modal',
    props: {
        isOpen: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            default: 'Modal'
        }
    },
    emits: ['close'],
    methods: {
        closeModal() {
            this.$emit('close');
        }
    }
}
</script>

<style scoped lang="scss">
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--altbg);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background-color: var(--bg);
    border-radius: 8px;
    box-shadow: 0 2px 10px var(--text);
    max-width: 500px;
    width: 90%;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid var(--text);
}

.modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--text);
}

.modal-body {
    padding: 16px;
}

.modal-footer {
    padding: 16px;
    border-top: 1px solid var(--text);
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}
</style>