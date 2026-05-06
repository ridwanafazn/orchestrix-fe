<template>
  <div 
    ref="wrapperRef"
    class="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing bg-[#f8fafc]"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
    @wheel="onWheel"
    :style="{
      backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
      backgroundSize: `${20 * scale}px ${20 * scale}px`,
      backgroundPosition: `${panX}px ${panY}px`
    }"
  >
    
    <!-- FLOATING CONTROLS -->
    <div class="absolute bottom-6 right-6 z-50 flex flex-col gap-2" @mousedown.stop @wheel.stop>
      <div class="flex flex-col bg-white border-2 border-slate-200 rounded-lg shadow-md overflow-hidden">
        <button @click="zoomIn" class="p-2 hover:bg-slate-100 text-slate-700 transition-colors border-b border-slate-200 focus:outline-none" title="Zoom In">
          <Plus class="w-5 h-5" />
        </button>
        <button @click="zoomOut" class="p-2 hover:bg-slate-100 text-slate-700 transition-colors focus:outline-none" title="Zoom Out">
          <Minus class="w-5 h-5" />
        </button>
      </div>
      <button @click="fitToView" class="p-2 bg-white border-2 border-slate-200 rounded-lg shadow-md hover:bg-slate-100 text-slate-700 transition-colors flex items-center justify-center focus:outline-none" title="Reset & Center">
        <Focus class="w-5 h-5" />
      </button>
    </div>

    <!-- CANVAS/BOARD -->
    <div 
      id="board-main" 
      class="absolute top-0 left-0 origin-top-left"
      :style="{ 
        width: '1300px', 
        height: '650px', 
        transform: `translate(${panX}px, ${panY}px) scale(${scale})` 
      }"
    >
      
      <!-- LAYER 1: SVG Jalur Kabel -->
      <svg class="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#94a3b8" />
          </marker>
        </defs>
        
        <line x1="120" y1="275" x2="380" y2="275" class="cable-line" />
        <line x1="380" y1="275" x2="660" y2="275" class="cable-line" />
        <line x1="660" y1="275" x2="940" y2="275" class="cable-line" />
        <path d="M 940 275 L 940 125 L 1180 125" class="cable-line" marker-end="url(#arrowhead)" />
        <path d="M 940 275 L 940 425 L 1180 425" class="cable-line" marker-end="url(#arrowhead)" />
        <path d="M 940 275 L 940 425 L 680 425" class="cable-line-error" stroke-dasharray="5,5" />
      </svg>

      <!-- LAYER 2: Animasi Data -->
      <DataPacket v-for="job in jobStore.jobs" :key="job.job_id" :job="job" />

      <!-- BACKGROUND ZONES -->
      <div class="absolute left-0 top-4 bottom-4 w-[300px] border-r-2 border-dashed border-slate-300 bg-slate-200/20 rounded-l-xl z-0 flex items-start p-6">
        <span class="font-mono-tech text-[16px] font-bold text-slate-500 opacity-80 uppercase tracking-widest mt-2">PUBLIC ZONE</span>
      </div>
      <div class="absolute right-0 top-4 bottom-4 left-[300px] z-0 flex items-start p-6">
        <span class="font-mono-tech text-[16px] font-bold text-slate-500 opacity-80 uppercase tracking-widest mt-2">PRIVATE SUBNET</span>
      </div>

      <!-- LAYER 3: NODES -->
      <div id="node-client" class="flat-node" style="left: 120px; top: 275px;">
        <div class="node-box box-white">
          <MonitorSmartphone class="w-6 h-6 text-slate-700" />
        </div>
        <div class="label-group">
          <span class="node-label-primary">Client</span>
          <span class="node-label-secondary">NuxtJS - Cloudflare Pages</span>
        </div>
      </div>

      <div id="node-api" class="flat-node" style="left: 380px; top: 275px;">
        <div class="node-box box-dark">
          <Globe class="w-7 h-7 text-white" />
        </div>
        <div class="label-group">
          <span class="node-label-primary">RESTful API</span>
          <span class="node-label-secondary">Fly.io - Golang Gin</span>
        </div>
      </div>

      <div id="node-queue" class="flat-node" style="left: 660px; top: 275px;">
        <div class="node-box box-orange rounded-full">
          <ArrowRightLeft class="w-7 h-7 text-orange-600" />
        </div>
        <div class="label-group">
          <span class="node-label-primary">Message Broker</span>
          <span class="node-label-secondary">CloudAMQP RabbitMQ</span>
        </div>
      </div>

      <div id="node-worker" class="flat-node" style="left: 940px; top: 275px;">
        <div class="node-box box-white">
          <Cpu class="w-6 h-6 text-blue-600" />
        </div>
        <div class="label-group">
          <span class="node-label-primary">Goroutine</span>
          <span class="node-label-secondary">High-Perf Concurrent Worker</span>
        </div>
      </div>

      <div id="node-storage" class="flat-node" style="left: 1200px; top: 125px;">
        <div class="node-box box-green">
          <HardDrive class="w-6 h-6 text-emerald-700" />
        </div>
        <div class="label-group">
          <span class="node-label-primary">Cloud Storage</span>
          <span class="node-label-secondary">Cloudflare R2</span>
        </div>
      </div>

      <div id="node-db" class="flat-node" style="left: 1200px; top: 425px;">
        <div class="node-box box-white">
          <Database class="w-6 h-6 text-slate-700" />
        </div>
        <div class="label-group">
          <span class="node-label-primary">Neon Tech</span>
          <span class="node-label-secondary">Serverless PostgreSQL</span>
        </div>
      </div>

      <div id="node-dlq" class="flat-node" style="left: 660px; top: 425px;">
        <div class="node-box box-red">
          <AlertTriangle class="w-6 h-6 text-red-600 animate-pulse" />
        </div>
        <div class="label-group">
          <span class="node-label-primary primary-error">Quarantine Hub</span>
          <span class="node-label-secondary secondary-error">Dead Letter Storage</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Globe, ArrowRightLeft, Cpu, Database, MonitorSmartphone, HardDrive, AlertTriangle, Plus, Minus, Focus } from 'lucide-vue-next'
import { useJobStore } from '~/stores/job'
import DataPacket from '~/components/dashboard/DataPacket.vue'

const jobStore = useJobStore()

const wrapperRef = ref<HTMLElement | null>(null)
const scale = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)

// LOGIKA BARU: Fit to View yang terfokus pada konten inti
const fitToView = () => {
  if (!wrapperRef.value) return
  const { clientWidth, clientHeight } = wrapperRef.value
  
  // Ukuran "Bounding Box" imajiner yang hanya meliputi node (mengabaikan grid kosong pinggir)
  // X: dari 120 s/d 1200 (~lebar 1160px dengan margin)
  // Y: dari 125 s/d 425 (~tinggi 460px dengan margin teks bawah)
  const contentW = 1160
  const contentH = 460

  const sX = clientWidth / contentW
  const sY = clientHeight / contentH
  
  // 0.95 memberikan 5% ruang napas di tepi layar agar tidak terlalu mepet
  scale.value = Math.min(sX, sY) * 0.95

  // Titik pusat fokus kalkulasi berdasarkan kumpulan node, bukan tengah papan
  // Focus X = (120 + 1200) / 2 = 660
  // Focus Y = (125 + 425) / 2 = 275 + sedikit kompensasi turun untuk teks = 290
  const focusX = 660
  const focusY = 290

  panX.value = (clientWidth / 2) - (focusX * scale.value)
  panY.value = (clientHeight / 2) - (focusY * scale.value)
}

const zoomBy = (factor: number) => {
  if (!wrapperRef.value) return
  
  const { clientWidth, clientHeight } = wrapperRef.value
  const centerX = clientWidth / 2
  const centerY = clientHeight / 2
  
  const newScale = Math.min(Math.max(0.3, scale.value * factor), 2.5)
  
  panX.value = centerX - (centerX - panX.value) * (newScale / scale.value)
  panY.value = centerY - (centerY - panY.value) * (newScale / scale.value)
  scale.value = newScale
}

const zoomIn = () => zoomBy(1.2)
const zoomOut = () => zoomBy(0.8)

const onMouseDown = (e: MouseEvent) => {
  isDragging.value = true
  startX.value = e.clientX - panX.value
  startY.value = e.clientY - panY.value
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  panX.value = e.clientX - startX.value
  panY.value = e.clientY - startY.value
}

const onMouseUp = () => {
  isDragging.value = false
}

const onWheel = (e: WheelEvent) => {
  e.preventDefault()
  if (!wrapperRef.value) return
  
  const zoomFactor = 1.05
  const direction = e.deltaY < 0 ? 1 : -1
  const newScale = direction > 0 ? scale.value * zoomFactor : scale.value / zoomFactor
  
  const clampedScale = Math.min(Math.max(0.3, newScale), 2.5)
  
  const rect = wrapperRef.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  
  panX.value = mouseX - (mouseX - panX.value) * (clampedScale / scale.value)
  panY.value = mouseY - (mouseY - panY.value) * (clampedScale / scale.value)
  scale.value = clampedScale
}

onMounted(() => {
  fitToView()
  window.addEventListener('resize', fitToView)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', fitToView)
})
</script>

<style scoped>
.cable-line {
  fill: none;
  stroke: #94a3b8;
  stroke-width: 3;
  stroke-linejoin: round;
}

.cable-line-error {
  fill: none;
  stroke: #fca5a5;
  stroke-width: 3;
  stroke-linejoin: round;
}

.flat-node {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.node-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  border: 2px solid #1e293b;
  position: relative;
  transition: transform 0.2s ease;
}

.box-white { background-color: #ffffff; box-shadow: 4px 4px 0 #1e293b; }
.box-dark { background-color: #1e293b; border-color: #0f172a; box-shadow: 4px 4px 0 #0f172a; }
.box-orange { background-color: #ffedd5; border-color: #c2410c; box-shadow: 4px 4px 0 #c2410c; }
.box-green { background-color: #ecfdf5; border-color: #047857; box-shadow: 4px 4px 0 #047857; }
.box-red { background-color: #fef2f2; border-color: #b91c1c; box-shadow: 4px 4px 0 #b91c1c; }

.label-group {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px; 
}

.node-label-primary {
  font-family: monospace;
  font-size: 11px;
  font-weight: 800;
  color: #1e293b;
  background: white;
  padding: 4px 10px;
  border: 2px solid #1e293b;
  border-radius: 6px;
  box-shadow: 2px 2px 0 #1e293b;
  white-space: nowrap;
  z-index: 2;
}

.node-label-secondary {
  font-family: monospace;
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
  background: #f8fafc;
  padding: 2px 6px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  white-space: nowrap;
  transform: translateY(0);
  margin-top: -2px;
  z-index: 1;
}

.primary-error {
  color: #b91c1c;
  border-color: #b91c1c;
  box-shadow: 2px 2px 0 #b91c1c;
}

.secondary-error {
  color: #ef4444;
  border-color: #fca5a5;
  background: #fef2f2;
}
</style>