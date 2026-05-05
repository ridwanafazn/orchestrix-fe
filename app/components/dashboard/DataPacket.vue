<template>
  <div 
    ref="packetRef" 
    class="absolute w-3 h-3 rounded-full z-50 pointer-events-none"
    :class="glowColor"
    style="top: 0; left: 0; opacity: 0; transform: translate(-50%, -50%) translateZ(40px); transform-style: preserve-3d;"
  >
    <div class="absolute inset-0 rounded-full animate-ping opacity-75" :class="glowColor"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useDroneAnimation } from '~/composables/useDroneAnimation'

const props = defineProps({
  job: { type: Object, required: true }
})

const packetRef = ref<HTMLElement | null>(null)
const { flyBetween, hidePacket } = useDroneAnimation()

// Warna cahaya menyesuaikan status Golang
const glowColor = computed(() => {
  if (props.job.status === 'PENDING') return 'bg-blue-500 shadow-[0_0_15px_#3b82f6]'
  if (props.job.status === 'PROCESSING') return 'bg-amber-500 shadow-[0_0_20px_#f59e0b]'
  if (props.job.status === 'COMPLETED') return 'bg-emerald-400 shadow-[0_0_20px_#34d399]'
  return 'bg-red-500 shadow-[0_0_15px_#ef4444]'
})

onMounted(() => {
  if (!packetRef.value) return
  // Fase 1: Muncul dari Client, melesat ke API, lalu antre di RabbitMQ
  flyBetween(packetRef.value, 'node-client', 'node-api', () => {
    flyBetween(packetRef.value, 'node-api', 'node-queue')
  })
})

watch(() => props.job.status, (newStatus) => {
  if (!packetRef.value) return
  
  if (newStatus === 'PROCESSING') {
    // Fase 2: Pekerja menarik dari antrean
    flyBetween(packetRef.value, 'node-queue', 'node-worker')
  } 
  else if (newStatus === 'COMPLETED') {
    // Fase 3: Pekerja menyimpan ke MinIO, lalu kilatan hilang
    flyBetween(packetRef.value, 'node-worker', 'node-storage', () => {
      setTimeout(() => hidePacket(packetRef.value!), 500)
    })
  }
})
</script>