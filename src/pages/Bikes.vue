<template>
    <div class="products">
        <h1>Bikes</h1>
        <div class="products-list">
            <div v-for="product in bikes" :key="product.id" class="product-card">
                <h2>{{ product.name }}</h2>
                <button @click="openSplatModal(product)">View 3D File</button>
            </div>
        </div>

        <Modal :isOpen="isSplatModalOpen" title="Product Viewer" @close="closeSplatModal">
            <SplatViewer v-if="selectedProduct" :model="selectedProduct" :distance="selectedProductDistance" />
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { bikes } from '@/assets/bikes'
import SplatViewer from '@/components/modals/SplatViewer.vue'
import Modal from '@/components/base/Modal.vue'

const isSplatModalOpen = ref(false)
const selectedProduct = ref('')
const selectedProductDistance = ref(0)

function openSplatModal(product: { model: string; distance: number }) {
    selectedProduct.value = product.model
    selectedProductDistance.value = product.distance
    isSplatModalOpen.value = true
}

function closeSplatModal() {
    isSplatModalOpen.value = false
}
</script>

<style scoped>
.products {
    padding: 20px;
}

.products-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.product-card {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.price {
    font-weight: bold;
    color: #2c3e50;
    font-size: 1.2em;
}

button {
    color: var(--accent);
}
</style>