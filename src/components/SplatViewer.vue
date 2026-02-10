<template>
  <div ref="container" class="viewer"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import * as THREE from "three"
import { Viewer } from "@mkkellogg/gaussian-splats-3d"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

const container = ref(null)

let viewer = null
let controls = null
let animationId = null

let sceneRef = null
let cameraRef = null
let rendererRef = null

onMounted(async () => {
  const width = container.value.clientWidth
  const height = container.value.clientHeight

  // ===== Renderer =====
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.value.appendChild(renderer.domElement)
  rendererRef = renderer

  // ===== Scene =====
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x222222)
  sceneRef = scene

  // ===== Camera =====
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 1000)
  cameraRef = camera

  // ===== Orbit Controls =====
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  // ===== Gaussian Splat Viewer =====
  viewer = new Viewer({
    renderer,
    camera,
    scene,
    useBuiltInControls: false,
  })

  // ===== Load Splat =====
  const splatUrl = "/products/blastoise/point_cloud_29999.splat"
  await viewer.addSplatScene(splatUrl, {
    showLoadingUI: true,
    position: [0, 0, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, 1],
    radiusMultiplier: 0.05, // makes points visible
  })

  // ===== Wait until scene exists =====
  await new Promise((resolve) => {
    const wait = () => {
      if (viewer && viewer.scene) resolve()
      else requestAnimationFrame(wait)
    }
    wait()
  })

  // ===== Auto-scale & center =====
  autoFitSplat(viewer, camera, controls)

  window.addEventListener("resize", onResize)

  animate()
})

// ===== Animation loop =====
function animate() {
  animationId = requestAnimationFrame(animate)

  if (controls) controls.update()
  if (viewer) viewer.update()

  if (rendererRef && sceneRef && cameraRef) {
    rendererRef.render(sceneRef, cameraRef)
  }
}

// ===== Handle window resize =====
function onResize() {
  if (!container.value || !rendererRef || !cameraRef) return

  const width = container.value.clientWidth
  const height = container.value.clientHeight

  rendererRef.setSize(width, height)
  cameraRef.aspect = width / height
  cameraRef.updateProjectionMatrix()
}

// ===== Cleanup =====
onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener("resize", onResize)

  if (controls) controls.dispose()
  if (viewer) viewer.dispose()
  if (rendererRef) rendererRef.dispose()
})

// ===== Auto-fit the splat to camera =====
function autoFitSplat(viewer, camera, controls) {
  if (!viewer || !viewer.scene) return

  // Compute bounding box of all Points/Mesh in the scene
  const box = new THREE.Box3()
  viewer.scene.traverse((obj) => {
    if (obj.isPoints || obj.isMesh) box.expandByObject(obj)
  })

  if (box.isEmpty()) return

  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)

  // Center scene
  viewer.scene.position.sub(center)
  controls.target.set(0, 0, 0)

  // Scale to fit roughly in [-1,1]
  const maxDim = Math.max(size.x, size.y, size.z)
  const scaleFactor = 2 / maxDim
  viewer.scene.scale.setScalar(scaleFactor)

  // Position camera
  camera.position.set(0, 0, 3) // camera along +Z
  camera.lookAt(0, 0, 0)
  camera.updateProjectionMatrix()
  controls.update()
}
</script>

<style scoped>
.viewer {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>