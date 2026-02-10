<template>
  <div class="splat-wrapper">
    <!-- DISCLAIMER -->
    <div v-if="!accepted" class="disclaimer">
      <h3>AI-Generated Model Notice</h3>
      <p>
        This 3D model was generated using artificial intelligence and is
        provided for illustrative and conceptual purposes only. It may not
        be accurate, complete, or suitable for real-world decisions.
      </p>
      <button @click="accept">I Understand & Continue</button>
    </div>

    <!-- THREE CONTAINER -->
    <div v-if="accepted" class="viewer-ui">
      <div v-if="loading" class="loading-overlay">
        Loading 3D Model…
      </div>

      <div ref="container" class="splat-viewer"></div>

      <button
        v-if="arSupported"
        class="ar-btn"
        @click="startAR"
      >
        View in AR
      </button>
      <div id="ar-ui">
        <div class="ar-controls" v-if="isARMode">
          <button @click="rotateLeft">⟲ Left</button>
          <button @click="rotateRight">Right ⟳</button>
          <button @click="loadModel">Load Model</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  model: {
    type: String,
    required: true
  },
  distance: {
    type: Number,
    default: 1
  }
})

import { ref, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { SplatMesh } from '@sparkjsdev/spark'

const container = ref(null)
const accepted = ref(false)
const arSupported = ref(false)

let scene, camera, renderer, controls
let splat = null
let reticule = null
let hitTestSource = null
let hitTestSourceRequested = false
let xrSession = null
let selectPressed = false


const isARMode = ref(false)
const loading = ref(false)
const ROTATE_STEP = Math.PI / 8; // 22.5 degrees
const CAMERA_POSITION = new THREE.Vector3(props.distance, props.distance, 0)
const CAMERA_TARGET = new THREE.Vector3(props.distance, props.distance, 0)

function resize() {
  if (!container.value || !camera || !renderer) return
  const w = container.value.clientWidth
  const h = container.value.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}

async function accept() {
  accepted.value = true
  await nextTick()
  setTimeout(initThree, 50)
  checkARSupport()
}

function rotateLeft() {
  if (!splat) return;
  splat.rotation.y += ROTATE_STEP;
}

function rotateRight() {
  if (!splat) return;
  splat.rotation.y -= ROTATE_STEP;
}

function loadModel() {
  selectPressed = true
}

async function checkARSupport() {
  if (navigator.xr) {
    arSupported.value = await navigator.xr.isSessionSupported('immersive-ar')
  }
}

function initThree() {
  const width = container.value.clientWidth
  const height = container.value.clientHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 1000)
  camera.position.set(CAMERA_POSITION.x, CAMERA_POSITION.y, CAMERA_POSITION.z)
  camera.lookAt(CAMERA_TARGET)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.xr.enabled = true
  renderer.setSize(width, height)
  container.value.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // Normal 3D model
  loading.value = true
  splat = new SplatMesh({ url: props.model })

  splat.rotation.x = Math.PI
  scene.add(splat)

  splat.initialized.then(() => {
  loading.value = false
})

  renderer.setAnimationLoop(animate)
  window.addEventListener('resize', resize)
}

async function startAR() {
  xrSession = await navigator.xr.requestSession('immersive-ar', {
    requiredFeatures: ['local-floor', 'hit-test'],
    optionalFeatures: ['dom-overlay'],
    domOverlay: { root: document.getElementById('ar-ui') }
  })

  isARMode.value = true

  renderer.xr.setSession(xrSession)

  // Reticule for AR
  const geometry = new THREE.RingGeometry(0.08, 0.1, 32).rotateX(-Math.PI / 2)
  reticule = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
  reticule.visible = false
  scene.add(reticule)

  splat.visible = false // Hide normal model in AR

  // // Listen for select events
  // xrSession.addEventListener('select', () => {
  //   selectPressed = true
  // })

  xrSession.addEventListener('end', () => {
    isARMode.value = false;

    hitTestSourceRequested = false
    hitTestSource = null
    xrSession = null
    selectPressed = false

    splat.visible = true
    splat.position.set(0, 0, 0)
    splat.scale.setScalar(1)

    camera.position.set(CAMERA_POSITION)
    camera.lookAt(CAMERA_TARGET)
  })
}

function animate(timestamp, frame) {
  controls?.update()

  if (xrSession && frame && frame.getViewerPose && reticule) {
    const session = renderer.xr.getSession()

    // Hit-test setup
    if (!hitTestSourceRequested) {
      session.requestReferenceSpace('viewer').then((refSpace) => {
        session.requestHitTestSource({ space: refSpace }).then((source) => {
          hitTestSource = source
        })
      })
      session.addEventListener('end', () => {
        hitTestSourceRequested = false
        hitTestSource = null
      })
      hitTestSourceRequested = true
    }

    // Hit-test results
    if (hitTestSource) {
      const hitTestResults = frame.getHitTestResults(hitTestSource)
      if (hitTestResults.length) {
        const hit = hitTestResults[0]
        const pose = hit.getPose(renderer.xr.getReferenceSpace())
        reticule.visible = true
        reticule.position.set(
          pose.transform.position.x,
          pose.transform.position.y,
          pose.transform.position.z
        )

        // Spawn AR model on select
        if (selectPressed) {
          reticule.material.color.set(0xff0000) // Change reticule color on select

          splat.position.copy(reticule.position)
          splat.visible = true
          splat.scale.setScalar(1);

          selectPressed = false
          
        } else {
          reticule.material.color.set(0x00ff00) // Reset reticule color
        }
      } else {
        reticule.visible = false
      }
    }
  }

  renderer.render(scene, camera)
}

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  if (renderer) renderer.setAnimationLoop(null)
  if (controls) controls.dispose()
  if (splat?.dispose) splat.dispose()
  if (scene) {
    scene.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) obj.material.dispose?.()
    })
  }
  if (renderer) {
    renderer.dispose()
    container.value?.removeChild(renderer.domElement)
  }
})
</script>

<style scoped>
.splat-wrapper {
  width: 100%;
  height: 70vh;
  position: relative;
}

.disclaimer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  padding: 24px;
}

.disclaimer button {
  padding: 10px 16px;
  cursor: pointer;
}

.viewer-ui {
  width: 100%;
  height: 100%;
  position: relative;
}

.splat-viewer {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

.ar-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  background-color: #008cdd;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

#ar-ui {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background-color: blueviolet;
}
.ar-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}
#ar-ui button {
  font-size: 18px;
  padding: 10px 16px;
  margin: 0 8px;
  word-break: keep-all;
  white-space: nowrap;
}
</style>
