<template>
  <div ref="container" class="viewer"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js"

const container = ref(null)
let camera, scene, renderer, controls
let animationId

onMounted(() => {
  const width = container.value.clientWidth
  const height = container.value.clientHeight

  // ===== Renderer =====
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  container.value.appendChild(renderer.domElement)

  // ===== Scene =====
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x222222)

  // ===== Camera =====
  camera = new THREE.PerspectiveCamera(60, width / height, 0.001, 1000)
  camera.position.set(0, 0, 1)

  // ===== Controls =====
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  // ===== Load PLY =====
  const loader = new PLYLoader()
  const plyUrl = "/products/blastoise/raymon.ply"
  loader.load(plyUrl, (geometry) => {
    geometry.computeVertexNormals()

    // Add colors if missing
    if (!geometry.hasAttribute("color")) {
      const count = geometry.attributes.position.count
      const colors = new Float32Array(count * 3).fill(1.0) // default white
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    }

    const material = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.02,       // base point size
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // ===== Auto-center & scale =====
    const box = new THREE.Box3().setFromObject(points)
    const center = new THREE.Vector3()
    const size = new THREE.Vector3()
    box.getCenter(center)
    box.getSize(size)
    points.position.sub(center) // center cloud

    // Normalize size so cloud fits in view
    const maxDim = Math.max(size.x, size.y, size.z)
    const scaleFactor = 1.0 / maxDim
    points.scale.setScalar(scaleFactor)

    // Position camera
    camera.position.set(0, 0, 2)
    camera.lookAt(0, 0, 0)
    controls.target.set(0, 0, 0)
    controls.update()
  })

  // ===== Animate =====
  function animate() {
    animationId = requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // ===== Handle resize =====
  window.addEventListener("resize", onResize)
})

function onResize() {
  if (!container.value || !renderer || !camera) return
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  if (controls) controls.dispose()
  if (renderer) renderer.dispose()
  window.removeEventListener("resize", onResize)
})
</script>

<style scoped>
.viewer {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
